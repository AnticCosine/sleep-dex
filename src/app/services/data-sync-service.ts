import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from './recipe-service';
import { IngredientService } from './ingredient-service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { PokemonService } from './pokemon-service';

@Injectable({
  providedIn: 'root',
})
export class DataSyncService {
  private readonly API = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private pokemonService: PokemonService
  ) {}

  async syncOnLogin(token: string): Promise<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    try {
      const [remoteRecipes, remoteIngredients, remoteStyles] = await Promise.all([
        firstValueFrom(this.http.get<string[]>(`${this.API}/user/recipes`, { headers })),
        firstValueFrom(
          this.http.get<{ ingredientId: string; quantity: number }[]>(
            `${this.API}/user/ingredients`,
            { headers }
          )
        ),
        firstValueFrom(
          this.http.get<{ [pokemonId: string]: number[] }>(
            `${this.API}/user/pokemon/styles`,
            { headers }
          )
        ),
      ]);
      
      const recipes = remoteRecipes ?? [];
      const ingredients = remoteIngredients ?? [];
      const styles = remoteStyles ?? {};

      const flatIngredients = Object.fromEntries(
        ingredients.map(({ ingredientId, quantity }) => [ingredientId, quantity])
      );

      const hasRemoteData = recipes.length > 0 || ingredients.length > 0 || Object.keys(styles).length > 0;
 
      if (hasRemoteData) {
        this.recipeService.saveRecipe(recipes);
        this.ingredientService.syncFromRemote(flatIngredients);
        if (Object.keys(styles).length > 0) {
          this.pokemonService.syncFromRemote(styles);
        }
      } else {
        const localRecipes = this.recipeService.loadRecipes();
        const localIngredients = this.ingredientService.loadFromStorage();
        const localStyles = this.pokemonService.loadStyles();
        const uploads: Promise<any>[] = [];
        if (localRecipes.length > 0) {
          uploads.push(
            firstValueFrom(
              this.http.put(
                `${this.API}/user/recipes`,
                { recipes: localRecipes },
                { headers }
              )
            )
          );
        }
 
        const ingredientEntries = Object.entries(localIngredients);
        if (ingredientEntries.length > 0) {

          const payload = ingredientEntries.map(([ingredientId, quantity]) => ({
            ingredientId,
            quantity,
          }));

          uploads.push(
            firstValueFrom(
              this.http.put(
                `${this.API}/user/ingredients`,
                { ingredients: payload },
                { headers }
              )
            )
          );
        }

        if (Object.keys(localStyles).length > 0) {
          uploads.push(
            firstValueFrom(this.http.put(`${this.API}/user/pokemon/styles`, { styles: localStyles }, { headers }))
          );
        }
 
        await Promise.all(uploads);
      }
    } catch (err) {
      console.error('Data sync failed:', err);
    }
  }
}