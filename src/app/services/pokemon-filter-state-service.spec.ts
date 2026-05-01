import { TestBed } from '@angular/core/testing';

import { PokemonFilterStateService } from './pokemon-filter-state-service';

describe('PokemonFilterStateService', () => {
  let service: PokemonFilterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonFilterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
