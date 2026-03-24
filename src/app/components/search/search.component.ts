import { Component } from '@angular/core';
import { VerbDetails } from '../../model/verb-details';
import { VerbInputComponent } from './verb-input/verb-input.component';
import { VerbInfoComponent } from './verb-info/verb-info.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [VerbInputComponent, VerbInfoComponent, RouterLink, TranslatePipe],
})
export class SearchComponent {
  protected selected: VerbDetails | null = null;
}
