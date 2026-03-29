import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallback {
  constructor(private authService: AuthService, private router: Router) {}
 
  ngOnInit() {
    this.router.navigate(['/']);
  }
}