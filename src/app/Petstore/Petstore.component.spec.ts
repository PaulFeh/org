import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetstoreComponent } from './Petstore.component';

describe('PetstoreComponent', () => {
  let component: PetstoreComponent;
  let fixture: ComponentFixture<PetstoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetstoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PetstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
