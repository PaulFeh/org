// src/app/services/adoption.service.ts
import { Injectable, signal } from '@angular/core';

export interface AdoptedPet {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AdoptionService {
  adoptedPets = signal<AdoptedPet[]>([]);

  constructor() {
    this.loadFromStorage();
    window.addEventListener('storage', (event) => {
      if (event.key === 'adoptedPets') {
        this.loadFromStorage();
      }
    });
  }

  addPet(pet: AdoptedPet) {
    if (!this.adoptedPets().some((p) => p.id === pet.id)) {
      const updated = [...this.adoptedPets(), pet];
      localStorage.setItem('adoptedPets', JSON.stringify(updated));
      this.adoptedPets.set(updated);
      console.log(
        '[AdoptionService] Pet added:',
        pet,
        'Current cart:',
        updated
      );
    } else {
      console.log('[AdoptionService] Pet already in cart:', pet);
    }
  }

  loadFromStorage() {
    const stored = JSON.parse(localStorage.getItem('adoptedPets') || '[]');
    this.adoptedPets.set(Array.isArray(stored) ? stored : []);
  }
}
