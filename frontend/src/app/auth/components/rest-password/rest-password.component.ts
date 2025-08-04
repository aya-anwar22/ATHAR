import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ResetPasswordData } from '../../../core/models/auth.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './rest-password.component.html',
  styleUrls: ['./rest-password.component.scss']
})
export class RestPasswordComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const data: ResetPasswordData = {
        email: formValue.email!,
        code: formValue.code!,
        newPassword: formValue.newPassword!
      };

      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          console.log('Password reset successful:', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Password reset error:', err);
          alert(err.error?.message || 'Something went wrong while resetting the password.');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
