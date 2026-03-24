import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbInputComponent } from './verb-input.component';
import { testingTranslateProviders } from '../../../testing/testing-translate.providers';

describe('VerbInputComponent', () => {
  let component: VerbInputComponent;
  let fixture: ComponentFixture<VerbInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbInputComponent],
      providers: [...testingTranslateProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
