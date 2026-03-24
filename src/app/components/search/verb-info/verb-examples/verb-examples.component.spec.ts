import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbExamplesComponent } from './verb-examples.component';
import { testingTranslateProviders } from '../../../../testing/testing-translate.providers';

describe('VerbExamplesComponent', () => {
  let component: VerbExamplesComponent;
  let fixture: ComponentFixture<VerbExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbExamplesComponent],
      providers: [...testingTranslateProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(VerbExamplesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('details', {
      base: 'test',
      past: 'tested',
      participle: 'tested',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
