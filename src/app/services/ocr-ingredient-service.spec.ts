import { TestBed } from '@angular/core/testing';

import { OcrIngredientService } from './ocr-ingredient-service';

describe('OcrIngredientService', () => {
  let service: OcrIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcrIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
