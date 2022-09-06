import { Component, OnInit } from '@angular/core';
import { VerbDetails } from '../../model/verb-details';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  selected?: VerbDetails;
}
