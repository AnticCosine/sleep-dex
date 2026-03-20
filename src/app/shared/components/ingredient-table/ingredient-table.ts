import { Component } from '@angular/core';
import { IngredientService, IngredientStatus } from '../../../services/ingredient-service';
import { Observable } from 'rxjs';
import { Ingredient } from '../../../models/ingredient.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-table',
  imports: [CommonModule],
  templateUrl: './ingredient-table.html',
  styleUrl: './ingredient-table.css',
})
export class IngredientTable {

  ingredients$!: Observable<Ingredient[]>;
 
  constructor(private ingredientService: IngredientService) {}

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
}
