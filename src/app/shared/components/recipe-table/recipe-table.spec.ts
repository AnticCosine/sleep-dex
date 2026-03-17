import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeTable } from './recipe-table';

describe('RecipeTable', () => {
  let component: RecipeTable;
  let fixture: ComponentFixture<RecipeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeTable],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
