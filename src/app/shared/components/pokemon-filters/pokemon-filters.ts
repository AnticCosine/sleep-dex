import { Component, HostListener, Input } from '@angular/core';
import { PokemonFilterStateService } from '../../../services/pokemon-filter-state-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-filters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pokemon-filters.html',
  styleUrl: './pokemon-filters.css',
})
export class PokemonFilters {

  @Input() filterState!: PokemonFilterStateService;

  mobileView = false;




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
