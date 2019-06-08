import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  type: string;

  constructor() {
    this.type = 'weap';
  }

  ngOnInit() {
  }

  selInv(type: string) {
    this.type = type;
  }
}
