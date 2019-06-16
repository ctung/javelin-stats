import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Item } from '../classes/item';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ToggleBuff } from '../jav.state';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnChanges {
  @Input() type: string;
  @Input() slot: number;
  @Output() output: EventEmitter<any> = new EventEmitter();
  slotName: string;
  item$: Observable<Item>;

  constructor(
    private store: Store
  ) { }

  ngOnChanges() {
    this.item$ = this.store
      .select(state => state.javelins.javelins[state.javelins.selected.javClass][state.javelins.selected.javSlot][this.type][this.slot]);
    this.slotName = (this.type === 'gear') ? `Ability\u00A0` + (this.slot + 1) : '';
  }

  selItem() {
    this.output.emit([this.type, this.slot]);
  }

  toggleActive() {
    this.store.dispatch(new ToggleBuff(this.type, this.slot));
  }

}

