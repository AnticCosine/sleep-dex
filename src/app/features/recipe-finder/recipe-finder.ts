import { Component } from '@angular/core';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../models/recipe.models';
import { RecipeService } from '../../services/recipe-service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-finder',
  imports: [RecipeCard, CommonModule],
  templateUrl: './recipe-finder.html',
  styleUrl: './recipe-finder.css',
})
export class RecipeFinder {
  
  recipes$!: Observable<Recipe[]>;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipes$ = this.recipeService.GetRecipes();
  }
}
