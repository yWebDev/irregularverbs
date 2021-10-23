import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { VerbsService } from '../../services/verbs/verbs.service';

@Component({
  selector: 'app-verb-input',
  templateUrl: './verb-input.component.html',
  styleUrls: ['./verb-input.component.scss']
})
export class VerbInputComponent implements OnInit {

  options: string[] = ['Arise', 'Run', 'Be'];
  myControl = new FormControl();

  constructor(private verbsService: VerbsService) {
  }

  ngOnInit(): void {
  }

}
