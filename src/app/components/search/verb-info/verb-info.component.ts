import { Component, input } from '@angular/core';
import { VerbDetails } from '../../../model/verb-details';
import { VerbExamplesComponent } from './verb-examples/verb-examples.component';

@Component({
    selector: 'app-verb-info',
    templateUrl: './verb-info.component.html',
    styleUrls: ['./verb-info.component.scss'],
    imports: [VerbExamplesComponent]
})
export class VerbInfoComponent {
  details = input<VerbDetails | null>();
}
