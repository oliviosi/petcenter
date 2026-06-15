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
}: {
  onSelect: (pet: Pet) => void;
}) {
  const [pets, setPets] = useState<Pet[]>([]);

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-content-primary">Selecione o Pet</h3>
        <Button href="#" variant="ghost" size="sm">+ New Pet</Button>
      </div>

      <div className="flex gap-3">
        {pets.map((pet) => (
          <Card key={pet.id} className="flex cursor-pointer items-center gap-3 p-3" onClick={() => onSelect(pet)}>
            <div className="h-12 w-12 rounded-lg bg-surface-muted" />
            <div>
              <p className="text-sm font-medium text-content-primary">{pet.name}</p>
              <p className="text-xs text-content-secondary">{pet.species}</p>
            </div>
          </Card>
        ))}

        <Card className="flex items-center justify-center p-3">
          <Button href="#" variant="secondary">+ Adicionar Pet</Button>
        </Card>
      </div>
    </div>
  );
}
