import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Item } from '../classes/item';
import { Observable } from 'rxjs';
import { JavelinService } from '../services/javelin.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnChanges {
  @Input() javClass: string;
  @Input() javSlot: number;
  @Input() type: string;
  @Input() slot: number;
  @Output() output: EventEmitter<any> = new EventEmitter();
  slotName: string;
  item$: Observable<Item>;

  constructor(
    private javelinService: JavelinService,
    private store: Store
  ) {
  }

  ngOnChanges() {
    this.item$ = this.store.select(state => state.javelins.javelins[this.javClass][this.javSlot][this.type][this.slot]);
    this.slotName = (this.type === 'gear') ? `Ability\u00A0` + (this.slot + 1) : '';
  }

  selItem() {
    this.output.emit([this.type, this.slot]);
  }
  /*
    toggleActive() {
      this.javelinService.toggleBuff(this.jav, this.type, this.slot, !this.itemDetails.bactive);
    }
    */
}

