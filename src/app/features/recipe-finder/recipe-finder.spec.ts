import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeFinder } from './recipe-finder';

describe('RecipeFinder', () => {
  let component: RecipeFinder;
  let fixture: ComponentFixture<RecipeFinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeFinder],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeFinder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
