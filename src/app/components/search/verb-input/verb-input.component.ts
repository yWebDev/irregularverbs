import { Component, output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VerbsService } from '../../../services/verbs/verbs.service';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { VerbDetails, VerbSearchOption } from '../../../model/verb-details';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatFormField, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { verbSearchTermValidator } from '../../../validators/verb-search.validators';

@Component({
  selector: 'app-verb-input',
  templateUrl: './verb-input.component.html',
  styleUrls: ['./verb-input.component.scss'],
  imports: [
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatIconButton,
    MatSuffix,
    MatIcon,
    AsyncPipe,
    TranslatePipe,
    MatError,
  ],
})
export class VerbInputComponent {
  protected readonly verbSelect = output<VerbDetails | null>();
  private readonly verbsService = inject(VerbsService);

  protected readonly searchForm = new FormGroup({
    term: new FormControl<string | VerbSearchOption | null>(null, {
      validators: [verbSearchTermValidator()],
    }),
  });

  protected options$: Observable<VerbSearchOption[]> = this.searchForm.controls.term.valueChanges.pipe(
    debounceTime(150),
    switchMap((term) => {
      if (typeof term !== 'string' || term.trim().length < 2) {
        return of([]);
      }
      return this.verbsService.search(term.trim());
    }),
  );

  protected onSelect(event: MatAutocompleteSelectedEvent): void {
    this.verbSelect.emit(event.option.value);
  }

  protected getOptionLabel(option: VerbSearchOption): string {
    const key = option?.matched;
    if (!option || !key) {
      return '';
    }
    const value = option[key];
    return value != null ? String(value) : '';
  }

  protected clearSelectedValue(): void {
    this.searchForm.controls.term.setValue(null);
    this.verbSelect.emit(null);
  }
}
