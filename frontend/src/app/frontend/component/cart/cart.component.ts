import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCartService } from '../../../core/services/user-cart.service';
import { FormsModule } from '@angular/forms';
import { UserOrderService } from '../../../core/services/user-order.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service'; // ✅ تأكد إن دي موجودة
import { UserProfile } from '../../../core/models/user.model'; // ✅ موديل فيه addresses مثلاً

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  outdatedItems: any[] = [];

  addressId: string = '';
  addresses: any[] = [];
  noAddress: boolean = false;

  constructor(
    private cartService: UserCartService,
    private orderService: UserOrderService,
    private router: Router,
    private profileService: ProfileService // ✅
  ) {}

  ngOnInit(): void {
   this.cartService.getCart().subscribe(res => {
    this.cartItems = res.validItems;
    this.outdatedItems = res.outdatedItems;
  });

  this.profileService.getProfile().subscribe({
    next: (profile: UserProfile) => {
      this.addresses = profile.addresses || [];
      this.noAddress = this.addresses.length === 0;
    },
    error: () => {
      this.noAddress = true;
    }
  });
  }

  remove(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.productId._id !== productId);
    });
  }

  placeOrder(): void {
    if (!this.addressId.trim()) {
      alert('Please select an address');
      return;
    }

    this.orderService.placeOrder(this.addressId).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: () => {
        alert('Error placing order');
      }
    });
  }

  increaseQuantity(item: any): void {
    const newQuantity = item.quantity + 1;
    this.cartService.updateQuantity(item.productId._id, newQuantity).subscribe({
      next: () => item.quantity = newQuantity,
      error: () => alert('Error updating quantity')
    });
  }

  decreaseQuantity(item: any): void {
    if (item.quantity <= 1) return;
    const newQuantity = item.quantity - 1;
    this.cartService.updateQuantity(item.productId._id, newQuantity).subscribe({
      next: () => item.quantity = newQuantity,
      error: () => alert('Error updating quantity')
    });
  }
}
