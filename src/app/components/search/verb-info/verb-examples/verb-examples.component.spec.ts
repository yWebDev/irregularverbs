import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbExamplesComponent } from './verb-examples.component';

describe('VerbExamplesComponent', () => {
  let component: VerbExamplesComponent;
  let fixture: ComponentFixture<VerbExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbExamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
