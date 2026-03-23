import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  feedbackText = '';
  submitted = false;
  error = false;
  sending = false;
 
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}
 
  sendFeedback() {
    if (!this.feedbackText.trim()) return;

    this.sending = true;
    this.cdr.detectChanges();
    
    this.http
      .post(`${this.API}/feedback`, { message: this.feedbackText })
      .subscribe({
        next: () => {
          this.submitted = true;
          this.error = false;
          this.sending = false;
          this.feedbackText = '';
          this.cdr.detectChanges();
          setTimeout(() => (this.submitted = false), 3000);
        },
        error: () => {
          this.error = true;
          this.sending = false;
          this.cdr.detectChanges();
          setTimeout(() => (this.error = false), 3000);
        },
    });
  }
}
