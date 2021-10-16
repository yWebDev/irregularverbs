import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-verb-input',
  templateUrl: './verb-input.component.html',
  styleUrls: ['./verb-input.component.scss']
})
export class VerbInputComponent implements OnInit {

  options: string[] = ['Arise', 'Run', 'Be'];
  myControl = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

}
