import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdoptionService } from '../../api/services/adoption.service';

@Component({
  selector: 'app-shoppingcart',
  imports: [CommonModule],
  templateUrl: './shoppingcart.component.html',
  styleUrl: './shoppingcart.component.css',
  standalone: true,
})
export class ShoppingcartComponent {
  @Input() sidebarOpen = false;
  @Output() sidebarOpenChange = new EventEmitter<boolean>();

  adoptedPets = computed(() => this.adoptionService.adoptedPets());

  constructor(private adoptionService: AdoptionService) {}

  openSidebar() {
    this.sidebarOpen = true;
    this.sidebarOpenChange.emit(true);
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.sidebarOpenChange.emit(false);
  }
}
