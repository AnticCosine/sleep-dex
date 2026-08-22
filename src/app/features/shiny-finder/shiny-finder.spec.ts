import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShinyFinder } from './shiny-finder';

describe('ShinyFinder', () => {
  let component: ShinyFinder;
  let fixture: ComponentFixture<ShinyFinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShinyFinder],
    }).compileComponents();

    fixture = TestBed.createComponent(ShinyFinder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
