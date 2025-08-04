import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: `<p>Logging out...</p>`, 
})
export class LogoutComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.http.post('http://localhost:3000/v1/auth/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem('accessToken');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed', err);
          localStorage.removeItem('accessToken');
          this.router.navigate(['/login']);
        }
      });
  }
}
