# Smoke booking script for local development
# 1) GET /petshops/public -> use first petshop
# 2) GET /petshops/{id}/slots -> pick first slot
# 3) POST /bookings with required fields

$apiBase = $env:API_BASE_URL
if ([string]::IsNullOrWhiteSpace($apiBase)) { $apiBase = 'http://127.0.0.1:5000' }
Write-Output "Using API base: $apiBase"

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

# Get slots for petshop
try {
    $slots = Invoke-RestMethod -Uri "$apiBase/petshops/$($petshop.id)/slots" -TimeoutSec 20 -ErrorAction Stop
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
