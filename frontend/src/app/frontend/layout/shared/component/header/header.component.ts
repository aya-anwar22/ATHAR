import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserCartService } from '../../../../../core/services/user-cart.service';

@Component({
  standalone: true,  
  imports: [CommonModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string | null = null;
  cartItemCount: number = 0; // عدد عناصر الكارت
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
      // احسب عدد العناصر التي كميتها أكبر من صفر
      this.cartItemCount = res.validItems
        .filter(item => item.quantity > 0)
        .reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  logout(): void {
    this.authService.logout();
    this.userName = null;
    this.cartItemCount = 0;
    this.cartSubscription?.unsubscribe();
    this.router.navigate(['/']); 
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }
}
