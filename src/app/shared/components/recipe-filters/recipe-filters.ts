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
  @Input() ingredeintPlaceHolder? = false;
  @Input() showFormatToggle = false;
  @Output() formatChange = new EventEmitter<void>();

  mobileView = false;
  magnezoneProcs = 0; // number of times it can proc set it to 3 for now 
  magnezoneLevel = 1;
  magnezoneStrenghts = [0, 7, 10, 12, 17, 22, 27, 31];
  sundayBonus = false;

  ngOnInit(): void {
    this.checkScreen();
    const state = this.filterState.getMagnezoneState();
    this.magnezoneLevel = state.level;

    this.applyAndPersistMagnezone();
  }

  cycleMagnezone() {
    this.magnezoneProcs = (this.magnezoneProcs + 1) % 4;
    this.applyAndPersistMagnezone();
  }

  incrementMagnezone() {
    if (this.magnezoneLevel < 7) {
      this.magnezoneLevel++;
      this.applyAndPersistMagnezone();
    }
  }
  
  decrementMagnezone() {
    if (this.magnezoneLevel > 1) {
      this.magnezoneLevel--;
      this.applyAndPersistMagnezone();
    }
  }

  private applyAndPersistMagnezone() {
    const bonus = this.magnezoneProcs > 0
      ? this.magnezoneStrenghts[this.magnezoneLevel] * this.magnezoneProcs
      : 0;
    this.filterState.applyMagnezoneBonus(bonus, this.magnezoneLevel);
  }
  
  toggleSundayBonus() {
    this.sundayBonus = !this.sundayBonus;
    this.filterState.applySundayBonus(this.sundayBonus);
  }

  get effectivePotSize(): number | null {
    const base = this.filterState.potIngredientControl.value;
    const mag = this.filterState.magnezoneBonus.value ?? 0;
    const sunday = this.filterState.sundayBonusActive.value ?? false;
    if (base == null) return null;
    const afterSunday = sunday ? base * 2 : base;
    return afterSunday + mag;
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
