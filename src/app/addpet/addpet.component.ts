import { Component, inject } from '@angular/core';
import {
 injectMutation,
 injectQuery,
} from '@tanstack/angular-query-experimental';
import { PetService } from '../../api/services/pet.service';
import { lastValueFrom } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
 FormlyFieldConfig,
 FormlyModule,
} from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addpet',
  imports: [CommonModule,
   ReactiveFormsModule,
   FormlyModule,
   FormlyMaterialModule,
   MatButtonModule,],
  templateUrl: './addpet.component.html',
  styleUrl: './addpet.component.css'
})
export class AddpetComponent {
petService = inject(PetService);
router = inject(Router);
 query = injectQuery(() => ({
   queryKey: ['pets'],
   queryFn: () =>
     lastValueFrom(
       this.petService.findPetsByStatus$Json({ status: 'available' }),
     ),
 }));
 mutation = injectMutation(() => ({
   mutationFn: (pet: any) =>
     lastValueFrom(this.petService.addPet$Json$Json$Response({ body: pet })),
   onSuccess: () => {
     console.log('Pet added successfully:');
   },
 }));
 form = new FormGroup({});
 model: any = {};
fields: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    props: {
      label: 'Name',
      placeholder: 'Enter name',
      appearance: 'outline',
      floatLabel: 'always', 
    },
  },
  {
    key: 'category',
    type: 'select',
    props: {
      label: 'Category',
      placeholder: 'Select category',
      appearance: 'outline',
      floatLabel: 'always',
      options: [
        { value: { id: 1, name: 'Dogs' }, label: 'Dogs' },
        { value: { id: 2, name: 'Cats' }, label: 'Cats' },
        { value: { id: 3, name: 'Birds' }, label: 'Birds' },
        { value: { id: 4, name: 'Lions' }, label: 'Lions' },
        { value: { id: 5, name: 'Fish' }, label: 'Fish' },
        { value: { id: 6, name: 'Reptiles' }, label: 'Reptiles' },
      ],
    },
  },
  {
    key: 'tags',
    type: 'select',
    props: {
      label: 'Tags',
      placeholder: 'Select tags',
      multiple: true,
      appearance: 'outline',
      floatLabel: 'always',
      options: [
        { value: { id: 1, name: 'tag1' }, label: '1' },
        { value: { id: 2, name: 'tag2' }, label: '2' },
      ],
    },
  },
  {
    key: 'status',
    type: 'select',
    props: {
      label: 'Status',
      placeholder: 'Select',
      required: true,
      appearance: 'outline',
      floatLabel: 'always',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'pending', label: 'Pending' },
        { value: 'sold', label: 'Sold' },
      ],
    },
  },
  {
    key: 'photoUrls',
    type: 'repeat',
    props: {
      addText: 'Add Photo',
      placeholder: 'Add a photo URL',
      appearance: 'outline',
      floatLabel: 'always',
    },
    fieldArray: {
      type: 'input',
      props: {
        placeholder: 'url',
        label: 'Photo URL',
        appearance: 'outline',
        floatLabel: 'always',
        className: 'mt-4',
      },
    },
  },
];

 submit() {
   this.model.id = Date.now();
   alert(JSON.stringify(this.model));
   this.mutation.mutate(this.model);
   this.router.navigate(['/']);
 }


}
