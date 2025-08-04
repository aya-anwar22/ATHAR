import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { SignupData } from '../../../core/models/auth.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: passwordMatchValidator });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  signUpWithGoogle() {
    window.location.href = 'http://localhost:3000/v1/auth/google';
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const formValue = this.signUpForm.value;

      const data: SignupData = {
        userName: formValue.userName!,
        email: formValue.email!,
        password: formValue.password!,
        confirmPassword: formValue.confirmPassword!
      };

      this.authService.signup(data).subscribe({
        next: res => {
          console.log('Signup success:', res);
          this.router.navigate(['/verify-email']);
        },
        error: err => {
          console.error('Signup error:', err);
        }
      });
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }
}
