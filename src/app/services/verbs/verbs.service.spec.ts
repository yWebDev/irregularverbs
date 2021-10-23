import { TestBed } from '@angular/core/testing';

import { VerbsService } from './verbs.service';

describe('VerbsService', () => {
  let service: VerbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
