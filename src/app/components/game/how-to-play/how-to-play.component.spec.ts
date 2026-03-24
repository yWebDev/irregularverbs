import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToPlayComponent } from './how-to-play.component';
import { testingTranslateProviders } from '../../../testing/testing-translate.providers';

describe('HowToPlayComponent', () => {
  let component: HowToPlayComponent;
  let fixture: ComponentFixture<HowToPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToPlayComponent],
      providers: [...testingTranslateProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(HowToPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
