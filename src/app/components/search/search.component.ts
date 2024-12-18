import { Component } from '@angular/core';
import { VerbDetails } from '../../model/verb-details';
import { VerbInputComponent } from './verb-input/verb-input.component';
import { VerbInfoComponent } from './verb-info/verb-info.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [VerbInputComponent, VerbInfoComponent, RouterLink],
})
export class SearchComponent {
  protected selected: VerbDetails | null = null;
}
