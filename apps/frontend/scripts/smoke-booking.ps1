# Smoke booking script for local development
# 1) GET /petshops/public -> use first petshop
# 2) GET /petshops/{id}/slots -> pick first slot
# 3) POST /bookings with required fields

$apiBase = $env:API_BASE_URL
if ([string]::IsNullOrWhiteSpace($apiBase)) { $apiBase = 'http://127.0.0.1:5000' }
Write-Output "Using API base: $apiBase"

$adminEmail = $env:DEV_ADMIN_EMAIL
if ([string]::IsNullOrWhiteSpace($adminEmail)) { $adminEmail = 'admin@petcenter.dev' }
$adminPassword = $env:DEV_ADMIN_PASSWORD
if ([string]::IsNullOrWhiteSpace($adminPassword)) { $adminPassword = '1234567az' }

try {
    $pub = Invoke-RestMethod -Uri "$apiBase/petshops/public" -TimeoutSec 10 -ErrorAction Stop
} catch {
    Write-Error "Failed to get public petshops: $($_.Exception.Message)"
    exit 1
}

# If API returned an array, pick first; if single object, use it
$petshop = $null
if ($pub -is [System.Array]) { $petshop = $pub[0] } else { $petshop = $pub }
if (-not $petshop) { Write-Error 'No public petshop found.'; exit 1 }
Write-Output "Using Petshop: $($petshop.nome) ($($petshop.id))"

# Determine serviceId: prefer env SERVICE_ID, otherwise login as admin and list services
$serviceId = $env:SERVICE_ID
if ([string]::IsNullOrWhiteSpace($serviceId)) {
    Write-Output 'Service ID not provided; logging in as admin to discover services.'
    try {
        $loginResp = Invoke-RestMethod -Uri "$apiBase/auth/login" -Method Post -Body (@{ Email = $adminEmail; Password = $adminPassword } | ConvertTo-Json) -ContentType 'application/json' -TimeoutSec 10 -ErrorAction Stop
        $token = $loginResp.Token
    } catch {
        Write-Error "Admin login failed: $($_.Exception.Message)"; exit 1
    }

    try {
        $services = Invoke-RestMethod -Uri "$apiBase/services" -Headers @{ Authorization = "Bearer $token" } -TimeoutSec 10 -ErrorAction Stop
    } catch {
        Write-Error "Failed to list services: $($_.Exception.Message)"; exit 1
    }

    if (-not $services -or $services.Count -eq 0) { Write-Error 'No services found for this tenant.'; exit 1 }
    $serviceId = $services[0].id
    Write-Output "Discovered serviceId: $serviceId"
}

# Get slots for petshop (pass serviceId)
try {
    $slots = Invoke-RestMethod -Uri "$apiBase/petshops/$($petshop.id)/slots?ServiceId=$serviceId" -TimeoutSec 20 -ErrorAction Stop
} catch {
    Write-Error "Failed to get slots: $($_.Exception.Message)"
    exit 1
}

if (-not $slots -or $slots.Count -eq 0) { Write-Error 'No slots available for this petshop.'; exit 1 }
$slot = $slots[0]
Write-Output "Found slot: ServiceId=$($slot.serviceId) ProfessionalId=$($slot.professionalId) Start=$($slot.slotStart) End=$($slot.slotEnd)"

$payload = @{ 
    PetshopId = $slot.petshopId
    ProfessionalId = $slot.professionalId
    ServiceId = $slot.serviceId
    SlotStart = $slot.slotStart
    SlotEnd = $slot.slotEnd
    OwnerContact = 'smoke-test@local'
    PetName = 'SmokePet'
    PetSpecies = 'cao'
}

Write-Output "Submitting booking payload:`n$(($payload | ConvertTo-Json -Depth 5))"

try {
    $resp = Invoke-RestMethod -Uri "$apiBase/bookings/" -Method Post -Body ($payload | ConvertTo-Json) -ContentType 'application/json' -TimeoutSec 30 -ErrorAction Stop
    Write-Output "Booking created: $(($resp | ConvertTo-Json -Depth 6))"
} catch {
    Write-Error "Booking request failed: $($_.Exception.Message)"
    if ($_.Exception.Response -and $_.Exception.Response.Content) { Write-Output $_.Exception.Response.Content.ReadAsStringAsync().Result }
    exit 1
}

Write-Output 'Smoke booking script completed successfully.'
