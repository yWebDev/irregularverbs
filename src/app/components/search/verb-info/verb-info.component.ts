import { Component, input } from '@angular/core';
import { VerbDetails } from '../../../model/verb-details';

@Component({
  selector: 'app-verb-info',
  templateUrl: './verb-info.component.html',
  styleUrls: ['./verb-info.component.scss'],
  standalone: true,
})
export class VerbInfoComponent {
  details = input<VerbDetails | null>();
}
