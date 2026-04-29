import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokemonService } from './pokemon-service';
import { PokemonFilterService } from './pokemon-filter-service';
import { combineLatest, debounceTime, map, Observable, ReplaySubject, startWith, take } from 'rxjs';
import { Pokemon, PokemonTypes } from '../models/pokemon.model';
import { Ingredient } from '../models/ingredient.model';
import { IngredientService } from './ingredient-service';
import { Berry } from '../models/berry.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonFilterStateService {

  searchControl = new FormControl('');
  ingredientControl = new FormControl<string[]>([]);
  berryControl = new FormControl<string[]>([]);
  pokemonTypeControl = new FormControl<string[]>([]);
  sleepTypeControl = new FormControl<string[]>([]);
  specialtyTypeControl = new FormControl<string[]>([]);


  ingredients$: Observable<Ingredient[]>;
  berries$: Observable<Berry[]>;
  pokemonTypes$: Observable<PokemonTypes[]>;
  filteredPokemon$: Observable<Pokemon[]>;

  constructor(
    private pokemonService: PokemonService,
    private ingredientService: IngredientService,
    private pokemonFilterService: PokemonFilterService
    ) {
      this.ingredients$ = this.ingredientService.GetIngredients();
      this.berries$ = this.ingredientService.GetBerries();
      this.pokemonTypes$ = this.pokemonService.GetPokemonTypes();
      const pokemon$ = this.pokemonService.getPokemon();
      const filteredPokemon = new ReplaySubject<Pokemon[]>(1);

      pokemon$.pipe(take(1)).subscribe(recipes => {


        combineLatest([
            pokemon$,
            this.searchControl.valueChanges.pipe(startWith(this.searchControl.value), debounceTime(100)),
            this.ingredientControl.valueChanges.pipe(startWith(this.ingredientControl.value)),
            this.berryControl.valueChanges.pipe(startWith(this.berryControl.value)),
            this.pokemonTypeControl.valueChanges.pipe(startWith(this.pokemonTypeControl.value)),
            this.sleepTypeControl.valueChanges.pipe(startWith(this.sleepTypeControl.value)),
            this.specialtyTypeControl.valueChanges.pipe(startWith(this.specialtyTypeControl.value)),
        ]).pipe(
          map(([pokemon, search, ingredient, berry, pokemonType, sleepType, specialtyType]) =>
            this.pokemonFilterService.filterPokemon(pokemon, {
              search, ingredient, berry, pokemonType, sleepType, specialtyType
            })
          )
        ).subscribe(filtered => filteredPokemon.next(filtered));

          // this.persistOnChange(); // used for local storage 
      });

      this.filteredPokemon$ = filteredPokemon.asObservable();
    }

  resetFilters() {
    this.searchControl.setValue('');
    this.ingredientControl.setValue([]);
    this.berryControl.setValue([]);
    this.pokemonTypeControl.setValue([]);
    this.sleepTypeControl.setValue([]);
    this.specialtyTypeControl.setValue([]);
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`;
  }

  toggleIngredient(id: string) {
    this.toggle(this.ingredientControl, id);
  }

  hasIngredient(id: string): boolean {
    return this.ingredientControl.value?.includes(id) ?? false;
  }

  imageBerryPath(berryId: string): string {
    return `assets/images/berries/${berryId}.png`;
  }

  toggleBerry(id: string) {
    this.toggle(this.berryControl, id);
  }

  hasBerry(id: string): boolean {
    return this.berryControl.value?.includes(id) ?? false;
  }

  imagePokemonTypePath(typeId: string): string {
    return `assets/images/pokemon-types/${typeId}.png`;
  }

  togglePokemonType(id: string) {
    this.toggle(this.pokemonTypeControl, id);
  }

  hasPokemonType(id: string): boolean {
    return this.pokemonTypeControl.value?.includes(id) ?? false;
  }

  toggleSleepType(id: string) {
    this.toggle(this.sleepTypeControl, id);
  }

  hasSleepType(id: string): boolean {
    return this.sleepTypeControl.value?.includes(id) ?? false;
  }

  toggleSpecialtyType(id: string) {
    this.toggle(this.specialtyTypeControl, id);
  }

  hasSpecialtyType(id: string): boolean {
    return this.specialtyTypeControl.value?.includes(id) ?? false;
  }

  private toggle(control: FormControl<string[] | null>, value: string) {
    const current = control.value ?? [];
    control.setValue(
      current.includes(value) ? current.filter(v => v !== value) : [...current, value]
    );
  }


}
