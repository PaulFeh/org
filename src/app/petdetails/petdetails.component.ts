import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PetService } from '../../api/services/pet.service';
import { StoreService } from '../../api/services/store.service';
import { lastValueFrom, delay, retry } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Category {
  id?: number;
  name?: string;
}

interface Tag {
  id?: number;
  name?: string;
}

export interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  status?: string;
}
@Component({
  selector: 'app-petdetails',
  templateUrl: './petdetails.component.html',
  styleUrl: './petdetails.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PetdetailsComponent {
  route = inject(ActivatedRoute);
  petService = inject(PetService);
  storeService = inject(StoreService);
  public pet?: Pet;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tryFetchPet(+id, 3);
    }
  }

  private async tryFetchPet(petId: number, attempts: number) {
    for (let i = 0; i < attempts; i++) {
      try {
        this.pet = await lastValueFrom(
          this.petService.getPetById$Json({ petId })
        );
        return;
      } catch (e) {
        if (i < attempts - 1) {
          await new Promise((res) => setTimeout(res, 300));
        } else {
          this.pet = undefined;
        }
      }
    }
  }

  adoptPet() {
    if (this.pet) {
      alert(`Adopting ${this.pet.name}...`);
      const order = {
        id: Date.now(),
        petId: this.pet.id,
        quantity: 1,
        shipDate: new Date().toISOString(),
        status: 'approved' as const,
        complete: true,
      };

      this.storeService
        .placeOrder$Json({
          body: order,
        })
        .subscribe({
          next: () => console.log('Order placed successfully'),
          error: (err) => console.error('Failed to place order', err),
        });
      localStorage.setItem('adoptedPet', JSON.stringify(this.pet));
      this.pet = undefined; // Clear pet after adoption
    }
  }

  fakeDescriptions: string[] = [
    'Loves belly rubs and long naps in the sun.',
    'A ball-chasing champion with a big heart.',
    'Shy at first, but becomes your shadow once bonded.',
    'Great with kids and loves squeaky toys.',
    'A curious explorer with a nose for snacks.',
    'Enjoys playing fetch and stealing socks.',
    'Always ready for an adventure or a cuddle session.',
    'Loyal, gentle, and looking for a forever home.',
    'A goofy goober who will keep you laughing.',
    'Loves walks, but loves treats even more.',
  ];

  getRandomDescription(): string {
    const key = this.pet?.id ?? this.pet?.name?.length ?? 0;
    return this.fakeDescriptions[key % this.fakeDescriptions.length];
  }
}
