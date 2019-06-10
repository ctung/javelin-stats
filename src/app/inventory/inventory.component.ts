import { Component } from '@angular/core';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  type: string;

  constructor() {
    this.type = 'weap';
  }

  selInv(type: string) {
    this.type = type;
  }
}
