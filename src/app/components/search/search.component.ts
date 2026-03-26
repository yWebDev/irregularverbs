import { Component } from '@angular/core';
import { VerbDetails } from '../../model/verb-details';
import { VerbInputComponent } from './verb-input/verb-input.component';
import { VerbInfoComponent } from './verb-info/verb-info.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from 'src/app/directives/scroll-reveal.directive';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [
    VerbInputComponent,
    VerbInfoComponent,
    RouterLink,
    TranslatePipe,
    ScrollRevealDirective,
  ],
})
export class SearchComponent {
  protected selected: VerbDetails | null = null;
}
