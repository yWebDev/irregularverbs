import { Component, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { VerbDetails } from 'src/app/model/verb-details';

@Component({
  selector: 'app-verb-examples',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './verb-examples.component.html',
  styleUrl: './verb-examples.component.scss',
})
export class VerbExamplesComponent {
  details = input.required<VerbDetails>();

  panelOpenState = signal(false);
}
