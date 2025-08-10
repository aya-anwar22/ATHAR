import { Component } from '@angular/core';
import { LoginComponent } from '../../auth/components/login/login.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/component/header/header.component';
import { FooterComponent } from './shared/component/footer/footer.component';
import { NavbarComponent } from './shared/component/navbar/navbar.component';
import { HeroComponent } from '../pages/hero/hero.component';
// import { ProductTabsComponent } from '../pages/product-tabs/product-tabs.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
