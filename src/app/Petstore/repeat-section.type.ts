import { Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'formly-repeat-section',
  standalone: true,
  imports: [FormlyModule, CommonModule, MatButtonModule, ReactiveFormsModule, FormlyMaterialModule],
  template: `
    <div class="mb-3 formly-field-repeat">
      <legend *ngIf="props.label" class="block mb-2 text-lg font-semibold">{{ props.label }}</legend>
      <p *ngIf="props.description">{{ props.description }}</p>
      <div
        *ngFor="let field of field.fieldGroup; let i = index"
        class="row align-items-baseline mb-4"
      >
        <formly-field class="col" [field]="field"></formly-field>
        <div class="col-1 d-flex align-items-center">
          <button
            mat-stroked-button
            color="warn"
            type="button"
            (click)="remove(i)"
            aria-label="Remove"
          >
            <span aria-hidden="true">-</span>
          </button>
        </div>
      </div>
      <div style="margin:40px 0 0 0;"> <!-- Increased margin-top to move the add button down -->
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="add()"
        >
          {{ props['addText'] }}
        </button>
      </div>
    </div>
  `,
})
export class RepeatTypeComponent extends FieldArrayType {}
