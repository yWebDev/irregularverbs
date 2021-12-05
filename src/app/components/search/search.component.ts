import { Component, OnInit } from '@angular/core';
import { VerbDetails } from '../../model/verb-details';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selected!: VerbDetails | null;

  constructor() { }

  ngOnInit(): void {
  }

}
