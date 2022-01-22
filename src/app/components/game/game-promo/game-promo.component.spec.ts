import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePromoComponent } from './game-promo.component';

describe('GamePromoComponent', () => {
  let component: GamePromoComponent;
  let fixture: ComponentFixture<GamePromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamePromoComponent ]
    })
    .compileComponents();
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
