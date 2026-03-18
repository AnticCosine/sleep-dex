import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientCalculator } from './ingredient-calculator';

describe('IngredientCalculator', () => {
  let component: IngredientCalculator;
  let fixture: ComponentFixture<IngredientCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientCalculator],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
