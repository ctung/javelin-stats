import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Item } from '../classes/item';
import { CompactJavelin } from '../classes/javelin';
import { BehaviorSubject } from 'rxjs';
import { JavelinService } from '../services/javelin.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [ItemService]
})
export class ItemComponent implements OnInit {
  @Input() jav: BehaviorSubject<CompactJavelin>;
  @Input() type: string;
  @Input() slot: number;
  @Output() output: EventEmitter<any> = new EventEmitter();
  itemDetails: Item;
  slotName: string;

  constructor(
    private itemService: ItemService,
    private javelinService: JavelinService
  ) {

  }

  ngOnInit() {
    this.jav.subscribe(j => {
      const cItem = j[this.type][this.slot];
      this.itemDetails = this.itemService.expand(this.type, cItem);
      this.slotName = (this.type === 'gear') ? `Ability\u00A0` + (this.slot + 1) : '';
    });
  }

  selItem() {
    this.output.emit([this.type, this.slot]);
  }

  toggleActive() {
    this.javelinService.toggleBuff(this.jav, this.type, this.slot, !this.itemDetails.bactive);
  }
}

