import {Component, Input, OnInit} from '@angular/core';
import {VerbDetails} from '../../model/verb-details';

@Component({
  selector: 'app-verb-info',
  templateUrl: './verb-info.component.html',
  styleUrls: ['./verb-info.component.scss']
})
export class VerbInfoComponent implements OnInit {
  @Input() details: VerbDetails = {
    verb: 'Arise',
    past: 'Arose',
    participle: 'Arisen'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
