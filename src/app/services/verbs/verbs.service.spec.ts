import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VerbsService } from './verbs.service';

describe('VerbsService', () => {
  let service: VerbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(VerbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose searchResults$ observable', () => {
    expect(service.searchResults$).toBeTruthy();
  });

  it('should update search term via updateSearchTerm', () => {
    expect(() => service.updateSearchTerm('run')).not.toThrow();
  });
});
