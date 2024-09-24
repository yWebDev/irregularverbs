import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbInfoComponent } from './verb-info.component';

describe('VerbInfoComponent', () => {
  let component: VerbInfoComponent;
  let fixture: ComponentFixture<VerbInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VerbInfoComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
