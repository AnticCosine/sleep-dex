import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { RecipeFilterStateService } from '../../../services/recipe-filter-state-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-filters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-filters.html',
  styleUrl: './recipe-filters.css',
})
export class RecipeFilters {
  @Input() filterState!: RecipeFilterStateService;
  @Input() showFormatToggle = false;
  @Output() formatChange = new EventEmitter<void>();


  mobileView = false;

  ngOnInit(): void {
    this.checkScreen();
  }

  changeRecipeFormat() {
    this.formatChange.emit();
  }

  @HostListener('window:resize')
  checkScreen() {
    const isMobile = window.matchMedia('(max-width: 550px)').matches;
    this.mobileView = isMobile;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdowns = document.querySelectorAll('details.dropdown');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target as Node)) {
        dropdown.removeAttribute('open');
      }
    });
  }

  onDropdownToggle(event: Event): void {
    const clicked = event.target as HTMLElement;
    const thisDropdown = clicked.closest('details.dropdown');
    const dropdowns = document.querySelectorAll('details.dropdown');
    dropdowns.forEach(dropdown => {
      if (dropdown !== thisDropdown) {
        dropdown.removeAttribute('open');
      }
    });
  }
}
