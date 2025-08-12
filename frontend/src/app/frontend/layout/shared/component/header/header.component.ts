import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserCartService } from '../../../../../core/services/user-cart.service';

@Component({
  standalone: true,  
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string | null = null;
  cartItemCount: number = 0;
  isMobileMenuOpen: boolean = false;
  isProfileDropdownOpen: boolean = false;
  private subscription?: Subscription;
  private cartSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: UserCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => {
      this.userName = user ? user.userName : null;
      if (this.userName) {
        this.loadCartCount();
      } else {
        this.cartItemCount = 0;
        this.cartSubscription?.unsubscribe();
      }
    });
  }

  loadCartCount(): void {
    this.cartSubscription = this.cartService.getCart().subscribe(res => {
      this.cartItemCount = res.validItems
        .filter(item => item.quantity > 0)
        .reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close profile dropdown when mobile menu is toggled
    if (this.isMobileMenuOpen) {
      this.isProfileDropdownOpen = false;
    }
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.mobile-menu-toggle')) {
      this.isProfileDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth > 992) {
      this.isMobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.userName = null;
    this.cartItemCount = 0;
    this.cartSubscription?.unsubscribe();
    this.isProfileDropdownOpen = false;
    this.isMobileMenuOpen = false;
    this.router.navigate(['/']); 
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }
}