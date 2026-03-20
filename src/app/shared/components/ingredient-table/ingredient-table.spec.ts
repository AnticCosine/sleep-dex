import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientTable } from './ingredient-table';

describe('IngredientTable', () => {
  let component: IngredientTable;
  let fixture: ComponentFixture<IngredientTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientTable],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
