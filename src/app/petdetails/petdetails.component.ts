import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PetService } from '../../api/services/pet.service';
import { StoreService } from '../../api/services/store.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AdoptionService } from 'src/api/services/adoption.service';

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
  imports: [CommonModule, RouterModule, NgOptimizedImage],
})
export class PetdetailsComponent {
  route = inject(ActivatedRoute);
  petService = inject(PetService);
  storeService = inject(StoreService);
  router = inject(Router);
  adoptionService = inject(AdoptionService);

  petId = +(this.route.snapshot.paramMap.get('id') ?? 0);

  petQuery = injectQuery(() => ({
    queryKey: ['pet', this.petId],
    queryFn: () =>
      lastValueFrom(this.petService.getPetById$Json({ petId: this.petId })),
    retry: 3,
    enabled: !!this.petId,
  }));

  get pet(): Pet | undefined {
    return this.petQuery.data();
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

      this.storeService.placeOrder$Json({ body: order }).subscribe({
        next: () => {
          console.log('Order placed successfully');

          this.adoptionService.addPet({
            id: this.pet?.id ?? 0,
            name: this.pet?.name ?? '',
          });

          this.router.navigate(['/']);
        },
        error: (err) => console.error('Failed to place order', err),
      });
    }
  }

  fakeDescriptions: string[] = [
    'Loves belly rubs, sunny window naps, and curling up beside you during movie nights.',
    'A ball-chasing champion with a giant heart who will greet you with wagging tail every day.',
    'Shy at first, but once bonded, becomes your loyal shadow and constant cuddle buddy.',
    'Perfect with kids, adores squeaky toys, and never says no to a backyard game of tag.',
    'A curious explorer with a nose for snacks, always on the lookout for hidden treats.',
    'Enjoys marathon fetch sessions, sneaking away with your socks, and silly zoomies indoors.',
    'Always ready for a spontaneous adventure or a cozy nap curled up on your lap.',
    'Loyal, gentle, endlessly patient, and dreaming of a warm and loving forever home.',
    'A goofy goober whose playful antics and zoomies will keep you laughing all day long.',
    'Loves long walks through the park but loves belly scratches and tasty treats even more.',
  ];

  getRandomDescription(): string {
    const key = this.pet?.id ?? this.pet?.name?.length ?? 0;
    return this.fakeDescriptions[key % this.fakeDescriptions.length];
  }
}
