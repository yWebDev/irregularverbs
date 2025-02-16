import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http: HttpClient = inject(HttpClient);

  #API_KEY!: string;
  #SALT = 'ig-verbs';

  loadConfig() {
    return this.http
      .get<{ API_KEY: string }>('/assets/config.json')
      .subscribe((data) => {
        this.#API_KEY = data?.API_KEY;
      });
  }

  get apiKey() {
    return this.#API_KEY + this.#SALT;
  }
}
