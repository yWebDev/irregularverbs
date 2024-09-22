import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor() {
    const firebaseApp = initializeApp(environment.fb);

    console.log(firebaseApp, 'FB init');
  }
}
