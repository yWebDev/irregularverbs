import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { VerbsService } from '../../../services/verbs/verbs.service';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { VerbDetails, VerbSearchOption } from '../../../model/verb-details';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-verb-input',
  templateUrl: './verb-input.component.html',
  styleUrls: ['./verb-input.component.scss'],
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
