import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = signal(false);
  userName = signal('');
  isProfileOpen = signal(false);
  isAdmin = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn.set(this.auth.isLoggedIn());
    this.userName.set(this.auth.getUsername());
    this.isAdmin.set(this.auth.isAdmin());
  }

  toggleProfile() {
    this.isProfileOpen.update(v => !v);
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn.set(false);
    this.router.navigate(['/auth']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
    this.isProfileOpen.set(false);
  }

  goAdmin() {
    this.router.navigate(['/admin']);
    this.isProfileOpen.set(false);
  }

  switchMode() {
    this.router.navigate(['/auth']);
    this.isProfileOpen.set(false);
  }
}
