import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAboutService } from '../../../core/services/user-about.service';

@Component({
  standalone: true,
  selector: 'app-user-about',
  imports: [CommonModule],
  templateUrl: './user-about.component.html'
})
export class UserAboutComponent implements OnInit {
  aboutData: any;

  constructor(private aboutService: UserAboutService) {}

  ngOnInit(): void {
    this.aboutService.getAbout().subscribe(res => {
      this.aboutData = res.about[0]; 
    });
  }
}
