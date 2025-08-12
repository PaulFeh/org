import { Component, inject } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { PetService } from '../../api/services/pet.service';
import { lastValueFrom } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-addpet',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './addpet.component.html',
  styleUrl: './addpet.component.css',
})
export class AddpetComponent {
  petService = inject(PetService);
  router = inject(Router);
  form = new FormGroup({});
  model: any = {};

  mutation = injectMutation(() => ({
    mutationFn: (pet: any) =>
      lastValueFrom(this.petService.addPet$Json$Json$Response({ body: pet })),
    onSuccess: () => {
      console.log('Pet added successfully');
      this.router.navigate(['/']);
    },
    onError: (error) => {
      alert('Failed to add pet: ' + (error?.message || 'Unknown error'));
    },
    retry: 2,
    retryDelay: 300,
  }));

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Pet Name',
        placeholder: 'Enter name',
        floatLabel: 'always',
        required: true,
      },
    },
    {
      key: 'category',
      type: 'select',
      props: {
        label: 'Category',
        placeholder: 'Select a pet type',
        floatLabel: 'always',
        required: true,
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
        label: 'Personality Traits',
        placeholder: 'Select one or more traits',
        floatLabel: 'always',

        multiple: true,
        options: [
          { value: { id: 1, name: 'Playful' }, label: 'Playful' },
          { value: { id: 2, name: 'Sleepy' }, label: 'Sleepy' },
          { value: { id: 3, name: 'Loyal' }, label: 'Loyal' },
          { value: { id: 4, name: 'Curious' }, label: 'Curious' },
          { value: { id: 5, name: 'Energetic' }, label: 'Energetic' },
        ],
      },
    },
    {
      key: 'status',
      type: 'select',
      props: {
        label: 'Status',
        placeholder: 'Available',
        floatLabel: 'always',
        disabled: true,
        required: true,
        options: [{ value: 'available', label: 'Available' }],
        defaultValue: 'available',
      },
    },

    // {
    //   key: 'photoUrls',
    //   type: 'repeat',
    //   props: {
    //     addText: 'Add Photo',
    //     placeholder: 'Add a photo URL',
    //     appearance: 'outline',
    //     floatLabel: 'always',
    //   },
    //   fieldArray: {
    //     type: 'input',
    //     props: {
    //       placeholder: 'url',
    //       label: 'Photo URL',
    //       appearance: 'outline',
    //       floatLabel: 'always',
    //       className: 'mt-4',
    //     },
    //   },
    // },
  ];

  submit() {
    this.model.id = Date.now();
    this.model.status = 'available';
    this.mutation.mutate(this.model);
  }

  editPet(pet: any) {
    this.model = { ...pet };
    this.form.markAsPristine();
  }
}
