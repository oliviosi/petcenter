"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Pet {
  id: string;
  name: string;
  species: string;
  avatar?: string;
}

export function PetSelector({
  onSelect,
  selectedId,
}: {
  onSelect: (pet: Pet) => void;
  selectedId?: string | null;
}) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<string | null>(selectedId ?? null);

  useEffect(() => {
    if (selectedId) setSelected(selectedId);
  }, [selectedId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("client_pets");
      if (raw) {
        setPets(JSON.parse(raw));
        return;
      }
    } catch (e) {
      // ignore
    }

    // fallback demo pets matching mockup
    setPets([
      { id: "p1", name: "Bento", species: "Golden Retriever" },
      { id: "p2", name: "Luna", species: "Persian" },
      { id: "p3", name: "Tobias", species: "Beagle" },
    ]);
  }, []);

  function persist(petsToSave: Pet[]) {
    try {
      localStorage.setItem("client_pets", JSON.stringify(petsToSave));
    } catch (e) {
      // ignore
    }
  }

  function handleOpenNew() {
    setName("");
    setSpecies("");
    setAvatarPreview(undefined);
    setAvatarFile(null);
    setOpen(true);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setAvatarFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(f);
  }

  function handleAddPet() {
    const id = `pet-${Date.now()}`;
    const newPet: Pet = { id, name: name || "Pet", species: species || "", avatar: avatarPreview };
    const updated = [...pets, newPet];
    setPets(updated);
    persist(updated);
    setOpen(false);
    setSelected(newPet.id);
    onSelect(newPet);
  }

  function handleSelectPet(pet: Pet) {
    setSelected(pet.id);
    onSelect(pet);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="headline-sm text-content-primary">Selecione o Pet</h3>
        <Button onClick={handleOpenNew} variant="ghost" size="sm" className="font-button">+ New Pet</Button>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
        {pets.map((pet) => (
          <div key={pet.id} className={`pet-card flex-shrink-0 w-36 p-3 cursor-pointer ${selected === pet.id ? 'selected' : ''}`} onClick={() => handleSelectPet(pet)} role="button" aria-pressed={selected === pet.id}>
            {pet.avatar ? (
              <img src={pet.avatar} alt={pet.name} className="pet-avatar mb-3 mx-auto" />
            ) : (
              <div className="pet-avatar mb-3 mx-auto bg-surface-muted" />
            )}
            <div className="text-center">
              <p className="body-md font-medium text-content-primary">{pet.name}</p>
              <p className="label-md text-content-secondary">{pet.species}</p>
            </div>
          </div>
        ))}

        <div className="flex-shrink-0 w-36 p-3">
          <Card className="h-full flex items-center justify-center p-3" onClick={handleOpenNew}>
            <Button variant="secondary">+ Adicionar Pet</Button>
          </Card>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h4 className="text-lg font-semibold mb-4">Adicionar Pet</h4>
            <div className="grid gap-3">
              <label className="text-sm">Nome</label>
              <input className="rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />

              <label className="text-sm">Espécie / Raça</label>
              <input className="rounded border px-3 py-2" value={species} onChange={(e) => setSpecies(e.target.value)} />

              <label className="text-sm">Foto do Pet (opcional)</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />

              {avatarPreview && (
                <img src={avatarPreview} alt="preview" className="mt-2 h-28 w-28 rounded-lg object-cover" />
              )}

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddPet}>Adicionar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
