import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  feedbackText = '';
  submitted = false;
 
  sendFeedback() {
    if (!this.feedbackText.trim()) return;
    
    console.log('Feedback submitted:', this.feedbackText);
    this.submitted = true;
    this.feedbackText = '';
    setTimeout(() => (this.submitted = false), 3000);
  }
}
