import { Component } from '@angular/core';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../models/recipe.models';
import { RecipeService } from '../../services/recipe-service';

@Component({
  selector: 'app-recipe-finder',
  imports: [RecipeCard],
  templateUrl: './recipe-finder.html',
  styleUrl: './recipe-finder.css',
})
export class RecipeFinder {
  
  recipes: Recipe[] = []

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.GetRecipes().subscribe(data => {
      this.recipes = data;
    });
    
  }
}
