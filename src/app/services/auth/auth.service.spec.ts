import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { authReducer } from '../../store/auth/auth.reducer';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore({ auth: authReducer }),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch login action and update localStorage', () => {
    service.login('TestUser');
    expect(localStorage.getItem('iv-username')).toBe('testuser');
  });

  it('should dispatch logout action and clear localStorage', () => {
    service.login('TestUser');
    service.delete();
    expect(localStorage.getItem('iv-username')).toBeNull();
  });

  it('should expose username$ observable from store', (done) => {
    service.login('alice');
    service.username$.subscribe((username) => {
      if (username === 'alice') {
        expect(username).toBe('alice');
        done();
      }
    });
  });
});
