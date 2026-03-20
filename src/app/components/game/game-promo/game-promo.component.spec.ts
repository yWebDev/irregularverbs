import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

import { GamePromoComponent } from './game-promo.component';

describe('GamePromoComponent', () => {
  let component: GamePromoComponent;
  let fixture: ComponentFixture<GamePromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePromoComponent],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
