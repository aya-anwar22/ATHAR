import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginData } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage: string | null = null; // ➜ دي هتظهر الرسالة

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const data: LoginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(data).subscribe({
        next: (res) => {
          console.log('Login success:', res);
          const accessToken = res.accessToken;
          const refreshToken = res.refreshToken;

          localStorage.setItem('accessToken', accessToken);
          // localStorage.setItem('refreshToken', refreshToken);

          this.errorMessage = null; // ✅ لو نجح امسح الرسالة

          const role = this.authService.getRole();

          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'Invalid email or password. Please try again.'; // ✅ هنا الرسالة
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  signUpWithGoogle() {
    window.location.href = 'http://localhost:3000/v1/auth/google';
  }
}

