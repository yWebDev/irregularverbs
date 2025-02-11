import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http: HttpClient = inject(HttpClient);

  private API_SECRET_KEY!: string;

  loadConfig() {
    return this.http
      .get<{ API_SECRET_KEY: string }>('/assets/config.json')
      .subscribe((data) => {
        this.API_SECRET_KEY = data?.API_SECRET_KEY;
      });
  }

  get apiKey() {
    return this.API_SECRET_KEY;
  }
}
