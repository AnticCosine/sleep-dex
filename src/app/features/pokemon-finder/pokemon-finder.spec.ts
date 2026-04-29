import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonFinder } from './pokemon-finder';

describe('PokemonFinder', () => {
  let component: PokemonFinder;
  let fixture: ComponentFixture<PokemonFinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonFinder],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonFinder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
