import { ChangeDetectorRef, Component } from '@angular/core';
import { IngredientService, IngredientStatus } from '../../../services/ingredient-service';
import { Observable } from 'rxjs';
import { Ingredient } from '../../../models/ingredient.model';
import { CommonModule } from '@angular/common';
import { OcrIngredientService } from '../../../services/ocr-ingredient-service';

@Component({
  selector: 'app-ingredient-table',
  imports: [CommonModule],
  templateUrl: './ingredient-table.html',
  styleUrl: './ingredient-table.css',
})
export class IngredientTable {

  ingredients$!: Observable<Ingredient[]>;
  tableCollapsed = false;
  clearConfirmPending = false;

  private clearResetTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly CONFIRM_TIMEOUT_MS = 3500;

  constructor(private ingredientService: IngredientService, private ocrIngredientService: OcrIngredientService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.ingredients$ = this.ingredientService.GetIngredients();
  }

  getQuantity(id: string): number {
    return this.ingredientService.getQuantity(id);
  }
 
  getStatus(id: string): IngredientStatus {
    return this.ingredientService.getStatus(id);
  }
 
  imageIngredientPath(id: string): string {
    return `assets/images/ingredients/${id}.png`;
  }

  async onImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    const results = await this.ocrIngredientService.processImage(file);
    //console.log('ingredient image results:', results);
    
    this.ingredientService.clearAllQuantities();
    this.ingredientService.setQuantities(
      results.map((item: { id: string; quantity: number }) => ({
        id: item.id,
        quantity: item.quantity,
      }))
    );
    this.cdr.markForCheck();

    input.value = '';
  }


  onQuantityBlur(event: FocusEvent, id: string): void {
    const el = event.target as HTMLElement;
    const raw = parseInt(el.textContent?.trim() ?? '', 10);
    const qty = isNaN(raw) || raw < 0 ? 0 : raw;
    el.textContent = String(qty);
    this.ingredientService.setQuantity(id, qty);
  }
 
  onQuantityFocus(event: FocusEvent): void {
    const el = event.target as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
 
  trackById(_: number, ingredient: Ingredient): string {
    return ingredient.id;
  }

  collapseTable() {
    this.tableCollapsed = !this.tableCollapsed;
  }

  async onClearAllClick(): Promise<void> {
    if (!this.clearConfirmPending) {
      this.clearConfirmPending = true;
      this.clearResetTimer = setTimeout(() => {
        this.clearConfirmPending = false;
        this.cdr.markForCheck();
      }, this.CONFIRM_TIMEOUT_MS);
    } else {
      this.cancelClearTimer();
      this.clearConfirmPending = false;
      await this.ingredientService.clearAllQuantities();
      this.cdr.markForCheck();
    }
  }

  private cancelClearTimer(): void {
    if (this.clearResetTimer !== null) {
      clearTimeout(this.clearResetTimer);
      this.clearResetTimer = null;
    }
  }
}
