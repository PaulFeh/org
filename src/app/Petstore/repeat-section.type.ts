import { Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
@Component({
 selector: 'formly-repeat-section',
 imports: [FormlyModule, CommonModule, MatButtonModule],
 template: `
   <div class="mb-3">
     <legend *ngIf="props.label">{{ props.label }}</legend>
     <p *ngIf="props.description">{{ props.description }}</p>
     <div
       *ngFor="let field of field.fieldGroup; let i = index"
       class="row align-items-baseline"
     >
       <formly-field class="col" [field]="field"></formly-field>
       <div class="col-1 d-flex align-items-center">
         <button
           mat-button
           class="btn btn-danger"
           type="button"
           (click)="remove(i)"
         >
           -
         </button>
       </div>
     </div>
     <div style="margin:30px 0;">
       <button
         mat-button
         class="btn btn-primary"
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



