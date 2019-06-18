import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Item } from '../classes/item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ToggleBuff } from '../jav.actions';
import { JavState } from '../jav.state';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() type: string;
  @Input() slot: number;
  @Output() output: EventEmitter<any> = new EventEmitter();
  slotName: string;
  item$: Observable<Item>;

  constructor(
    private store: Store
  ) {
    this.item$ = this.store.select(JavState.selectedItem)
      .pipe(map(filterFn => filterFn(this.type, this.slot)));
  }

  ngOnInit() {
    this.slotName = (this.type === 'gear') ? `Ability\u00A0` + (this.slot + 1) : '';
  }

  selItem() {
    this.output.emit([this.type, this.slot]);
  }

  toggleActive() {
    this.store.dispatch(new ToggleBuff(this.type, this.slot));
  }

}

