import { Component } from '@angular/core';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app';

// Add the Firebase products that you want to use
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iverbs';

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyA6-dhQBlmm2ZiDztraMW_rDEwqNHtCa8g",
      authDomain: "irregularverbs-c54fa.firebaseapp.com",
      projectId: "irregularverbs-c54fa",
      storageBucket: "irregularverbs-c54fa.appspot.com",
      messagingSenderId: "648844572143",
      appId: "1:648844572143:web:d2fd62366d582cc784b21a"
    }

    const firebaseApp = initializeApp(firebaseConfig);

    console.log(firebaseApp);
  }
}
