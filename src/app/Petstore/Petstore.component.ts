import { Component, inject } from '@angular/core';
import {
 injectMutation,
 injectQuery,
} from '@tanstack/angular-query-experimental';
import { PetService } from '../../api/services/pet.service';
import { lastValueFrom, map } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
 FormlyFieldConfig,
 FormlyModule,
} from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
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
 ],
 templateUrl: './Petstore.component.html',
 styleUrl: './Petstore.component.css',
})
export class PetstoreComponent {
 petService = inject(PetService);
query = injectQuery(() => ({
  queryKey: ['pets'],
  queryFn: () =>
    lastValueFrom(
      this.petService.findPetsByStatus$Json({ status: 'available' }).pipe(
        map((pets: any[]) => {
          const seen = new Set<string>();
          return pets.filter(pet => {
            const isValid = this.isValidName(pet.name);
            const isDuplicate = seen.has(pet.name);
            if (isValid && !isDuplicate) {
              seen.add(pet.name);
              return true;
            }
            return false;
          });
        }),
      ),
    ),
}));
 mutation = injectMutation(() => ({
   mutationFn: (pet: any) =>
     lastValueFrom(this.petService.addPet$Json$Json$Response({ body: pet })),
   onSuccess: () => {
     console.log('Pet added successfully:');
   },
 }));
 model: any = {};
 
isValidName(name: string): boolean {
  if (!name) return false;

  // Allow letters, spaces, and **only one number**
  const nameRegex = /^(?=(?:.*\d){0,1})[A-Za-z\d\s]{2,30}$/;
  return nameRegex.test(name.trim());
}


isRepeatedName(name: string): boolean {
  if (!name) return false;
  // Check if the name is already in the model's pets array
  return this.model.pets?.some((pet: any) => pet.name === name);
}


 submit() {
   alert(JSON.stringify(this.model));
   this.mutation.mutate(this.model);
 }

 trackByPetName(index: number, pet: any): string {
  return pet?.name || index;
}

}

