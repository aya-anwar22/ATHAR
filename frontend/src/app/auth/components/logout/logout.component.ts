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

logout(): void {
  console.log("Logging out...");
  const refreshToken = localStorage.getItem('refreshToken');
  console.log(refreshToken || null); // 👈 دي المفروض تطبع token أو null

  // بعدها تحذفي البيانات:
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');

  this.router.navigate(['/login']);
}


clearTokensAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  // this.router.navigate(['/login']);
}


}
