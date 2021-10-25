import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { VerbsService } from '../../services/verbs/verbs.service';
import { Observable } from 'rxjs';
import { debounce, debounceTime, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-verb-input',
  templateUrl: './verb-input.component.html',
  styleUrls: ['./verb-input.component.scss']
})
export class VerbInputComponent implements OnInit {

  options$!: Observable<string[]>;
  myControl = new FormControl();

  constructor(private verbsService: VerbsService) {
    this.options$ = this.myControl.valueChanges.pipe(
      debounceTime(150),
      filter(term => term?.length > 1),
      switchMap(term => this.verbsService.search(term)),
      map(verbs => {
        return verbs.map(v => v.base);
      })
    );
  }

  ngOnInit(): void {
  }

  onSelect(item: any): void {
    console.log(item);
  }

}
