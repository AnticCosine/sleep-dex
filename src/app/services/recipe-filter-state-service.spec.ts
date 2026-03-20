import { TestBed } from '@angular/core/testing';

import { RecipeFilterStateService } from './recipe-filter-state-service';

describe('RecipeFilterStateService', () => {
  let service: RecipeFilterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeFilterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
