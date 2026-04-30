import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { PokemonFilterStateService } from '../../../services/pokemon-filter-state-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NumberAbbreviatePipe } from '../../../pipes/number-abbreviate-pipe';

@Component({
  selector: 'app-pokemon-filters',
  imports: [CommonModule, ReactiveFormsModule, NumberAbbreviatePipe],
  templateUrl: './pokemon-filters.html',
  styleUrl: './pokemon-filters.css',
})
export class PokemonFilters {

  @Input() filterState!: PokemonFilterStateService;
  @ViewChild('trackFill') trackFillRef!: ElementRef<HTMLDivElement>;

  mobileView = false;

  readonly DROWSY_MIN = 76000;
  readonly DROWSY_MAX = 300000000;
  private subs = new Subscription();

  ngAfterViewInit(): void {
    this.subs.add(
      this.filterState.minDrowsyControl.valueChanges.subscribe(() => this.updateTrack())
    );
    this.subs.add(
      this.filterState.maxDrowsyControl.valueChanges.subscribe(() => this.updateTrack())
    );
    this.updateTrack();
  }
 
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onMinSlider(): void {
    const min = this.filterState.minDrowsyControl.value ?? this.DROWSY_MIN;
    const max = this.filterState.maxDrowsyControl.value ?? this.DROWSY_MAX;
    if (min > max) {
      this.filterState.minDrowsyControl.setValue(max, { emitEvent: false });
    }
    this.updateTrack();
  }
 
  onMaxSlider(): void {
    const min = this.filterState.minDrowsyControl.value ?? this.DROWSY_MIN;
    const max = this.filterState.maxDrowsyControl.value ?? this.DROWSY_MAX;
    if (max < min) {
      this.filterState.maxDrowsyControl.setValue(min, { emitEvent: false });
    }
    this.updateTrack();
  }
 
  private updateTrack(): void {
    if (!this.trackFillRef) return;
    const lo = this.drowsyMin;
    const hi = this.drowsyMax;
    const range = this.DROWSY_MAX - this.DROWSY_MIN;
    const pctLo = ((lo - this.DROWSY_MIN) / range) * 100;
    const pctHi = ((hi - this.DROWSY_MIN) / range) * 100;
    const el = this.trackFillRef.nativeElement;
    el.style.left  = `${pctLo}%`;
    el.style.right = `${100 - pctHi}%`;
  }

  get drowsyMin(): number {
    return this.filterState.minDrowsyControl.value ?? this.DROWSY_MIN;
  }
 
  get drowsyMax(): number {
    return this.filterState.maxDrowsyControl.value ?? this.DROWSY_MAX;
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

  getIslandImage(id: string): string {
    return `assets/images/islands/${id}.png`;
  }

}
