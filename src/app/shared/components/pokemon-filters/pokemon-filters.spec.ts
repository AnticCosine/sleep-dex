import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonFilters } from './pokemon-filters';

describe('PokemonFilters', () => {
  let component: PokemonFilters;
  let fixture: ComponentFixture<PokemonFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
