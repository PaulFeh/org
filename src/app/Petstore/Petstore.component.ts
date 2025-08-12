import { Component, inject } from '@angular/core';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { PetService } from '../../api/services/pet.service';
import { lastValueFrom, map } from 'rxjs';
import { Pet } from '../../api/models/pet';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-petstore',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatButtonModule,
    RouterModule,
    NgOptimizedImage,
  ],
  templateUrl: './Petstore.component.html',
  styleUrl: './Petstore.component.css',
})
export class PetstoreComponent {
  petService = inject(PetService);
  statusOptions = [
    { label: 'Available', value: 'available' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Sold', value: 'sold' as const },
  ];
  selectedStatus: 'available' | 'pending' | 'sold' = 'available';

  query = injectQuery(() => ({
    queryKey: ['pets', this.selectedStatus],
    queryFn: () =>
      lastValueFrom(
        this.petService
          .findPetsByStatus$Json({ status: this.selectedStatus })
          .pipe(
            map((pets: Pet[] = []) => {
              const seen = new Set<string>();
              return pets.filter((pet) => {
                const isValid = this.isValidName(pet.name);
                const isDuplicate = seen.has(pet.name);
                if (isValid && !isDuplicate) {
                  seen.add(pet.name);
                  return true;
                }
                return false;
              });
            })
          )
      ),
    enabled: true,
  }));

  mutation = injectMutation(() => ({
    mutationFn: (pet: Pet) =>
      lastValueFrom(this.petService.addPet$Json$Json$Response({ body: pet })),
    onSuccess: () => {
      console.log('Pet added successfully:');
    },
  }));
  model: Partial<Pet> = {};

  isValidName(name: string): boolean {
    if (!name) return false;
    const nameRegex = /^(?=(?:.*\d){0,1})[A-Za-z\d\s]{2,30}$/;
    return nameRegex.test(name.trim());
  }

  isRepeatedName(name: string): boolean {
    if (!name) return false;
    // @ts-expect-error: model.pets may not exist or may not be Pet[]
    return (this.model as { pets?: Pet[] }).pets?.some(
      (pet: Pet) => pet.name === name
    );
  }

  submit() {
    alert(JSON.stringify(this.model));
    this.mutation.mutate(this.model as Pet);
  }

  trackByPetName(index: number, pet: Pet): string {
    return pet?.name || String(index);
  }

  onStatusChange(status: string) {
    // Type guard to ensure we only accept valid status values
    if (status === 'available' || status === 'pending' || status === 'sold') {
      this.selectedStatus = status;
      // Refetch pets for the new status
      this.query.refetch();
    } else {
      console.warn('Invalid status value:', status);
    }
  }
}
