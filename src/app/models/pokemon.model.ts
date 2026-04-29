export interface Pokemon {
  id: string;
  pokedex_number: string;
  name: string;
  type: string;
  sleep_type: string;
  specialty: string;
  berry: PokemonBerry;
  ingredients: string[];
  number_of_sleep_styles: number;
  drowsy_power_requirement_list: (number | null)[];
}

export interface PokemonBerry {
  name: string;
  count: number;
}