import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent {

  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['/about']);
  }

}
