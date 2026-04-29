export interface Recipe {
    id: string;
    name: string;
    type: string;
    baseStrength: number;
    ingredients: RecipeIngredients[];
}

export interface RecipeIngredients {
    ingredientId: string;
    amount: number;
}