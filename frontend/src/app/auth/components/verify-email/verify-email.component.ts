import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { VerifyEmailData } from '../../../core/models/auth.model';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
  verifyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.verifyForm.valid) {
      const formValue = this.verifyForm.value;

      const data: VerifyEmailData = {
        email: formValue.email!,
        code: formValue.code!
      };

      this.authService.verifyEmail(data).subscribe({
        next: res => {
          console.log('Email verified!', res);
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error('Verification failed:', err);
        }
      });
    } else {
      this.verifyForm.markAllAsTouched();
    }
  }
}
