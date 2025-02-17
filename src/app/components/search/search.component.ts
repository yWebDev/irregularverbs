import { Component, inject } from '@angular/core';
import { VerbDetails } from '../../model/verb-details';
import { VerbInputComponent } from './verb-input/verb-input.component';
import { VerbInfoComponent } from './verb-info/verb-info.component';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../services/meta/meta.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [VerbInputComponent, VerbInfoComponent, RouterLink],
})
export class SearchComponent {
  protected selected: VerbDetails | null = null;

  private readonly metaService = inject(MetaService).updateMeta(
    'Learn Irregular Verb Forms Easily and Playfully!',
    'Have you ever wondered which form of an irregular verb is correct? For example, become or became, went or gone? This site is here to help!',
  );
}
