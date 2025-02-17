import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MetaService } from 'src/app/services/meta/meta.service';
import { VerbsService } from 'src/app/services/verbs/verbs.service';

@Component({
  selector: 'app-verbs',
  imports: [AsyncPipe, MatTableModule],
  templateUrl: './verbs.component.html',
  styleUrl: './verbs.component.scss',
})
export class VerbsComponent {
  private readonly metaService = inject(MetaService).updateMeta(
    'Complete List of Irregular Verbs',
    'Explore a comprehensive table of irregular verbs to enhance your English skills!',
  );

  $verbs = inject(VerbsService).getAllVerbs();

  protected readonly displayedColumns: string[] = [
    'base',
    'pastSimple',
    'pastParticiple',
  ];
}
