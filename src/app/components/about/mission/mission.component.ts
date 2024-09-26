import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent {

  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['/about']);
  }

}
