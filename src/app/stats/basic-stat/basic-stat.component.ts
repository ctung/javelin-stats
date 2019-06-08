import { Component,  Input } from '@angular/core';


@Component({
  selector: 'app-basic-stat',
  templateUrl: './basic-stat.component.html',
  styleUrls: ['./basic-stat.component.css']
})
export class BasicStatComponent {
  @Input() stats: any;
  @Input() last: boolean;
  constructor() {
  }


}

