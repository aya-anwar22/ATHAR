import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ForgetPasswordData } from '../../../core/models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const data: ForgetPasswordData = {
        email: formValue.email!
      };

      this.authService.forgetPassword(data).subscribe({
        next: res => {
          console.log('Email sent:', res);
          this.router.navigate(['/reset-password']);
        },
        error: err => {
          console.error('Error sending email:', err);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
