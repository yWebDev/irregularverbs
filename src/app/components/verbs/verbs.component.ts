import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { VerbsService } from 'src/app/services/verbs/verbs.service';

@Component({
  selector: 'app-verbs',
  imports: [AsyncPipe, MatTableModule],
  templateUrl: './verbs.component.html',
  styleUrl: './verbs.component.scss',
})
export class VerbsComponent {
  $verbs = inject(VerbsService).getAllVerbs();

  protected readonly displayedColumns: string[] = [
    'base',
    'pastSimple',
    'pastParticiple',
  ];
}
