import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShoppingcartComponent } from '../shoppingcart/shoppingcart.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, ShoppingcartComponent],
})
export class HeaderComponent {
  menuOpen = false;
  cartSidebarOpen = false;
  adoptedPets: { name: string; id: number }[] = [];

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  screenIsSmall(): boolean {
    return window.innerWidth < 768;
  }

  openCartSidebar(): void {
    this.cartSidebarOpen = true;
  }
}
