import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root'
})
export class VerbsService {

  constructor(private db: DbService) { }
}
