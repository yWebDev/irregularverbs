import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerbsService } from '../../../services/verbs/verbs.service';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { VerbDetails, VerbSearchOption } from '../../../model/verb-details';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-verb-input',
  templateUrl: './verb-input.component.html',
  styleUrls: ['./verb-input.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatButton,
    MatIconButton,
    MatSuffix,
    MatIcon,
    AsyncPipe,
  ],
})
export class VerbInputComponent {
  @Output() verbSelect = new EventEmitter<VerbDetails>();

  options$!: Observable<VerbSearchOption[]>;
  myControl = new FormControl();

  constructor(private verbsService: VerbsService) {
    this.options$ = this.myControl.valueChanges.pipe(
      debounceTime(150),
      switchMap((term) => {
        if (typeof term !== 'string' || term.length < 2) {
          return of([]);
        }
        return this.verbsService.search(term);
      }),
    );
  }

  onSelect(event: MatAutocompleteSelectedEvent): void {
    this.verbSelect.emit(event.option.value);
  }

  getOptionLabel(option: VerbSearchOption): string {
    return option?.[option?.matched];
  }

  clearSelectedValue(): void {
    this.myControl.setValue(null);
    this.verbSelect.emit();
  }
}
