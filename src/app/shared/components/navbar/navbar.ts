import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  menuOpen = false;
  showAuthModal = false;
  isLoggedIn$!: Observable<boolean>;

  constructor(private authService: AuthService, public themeService: ThemeService) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  openModal() {
    this.showAuthModal = true;
    this.menuOpen = false;
  }

  closeModal() {
    this.showAuthModal = false;
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
    this.closeModal();
  }
 
  signOut() {
    this.authService.signOut();
    this.menuOpen = false;
  }

}
