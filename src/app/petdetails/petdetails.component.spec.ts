import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetdetailsComponent } from './petdetails.component';

describe('PetdetailsComponent', () => {
  let component: PetdetailsComponent;
  let fixture: ComponentFixture<PetdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
