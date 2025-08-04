import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  template: `<p>Redirecting...</p>`,
})
export class OauthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('accessToken', token);
        this.router.navigate(['/']); 
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
