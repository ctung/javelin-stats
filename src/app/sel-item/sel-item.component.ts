import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../classes/item';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetJavItem } from '../jav.actions';


@Component({
  selector: 'app-sel-item',
  templateUrl: './sel-item.component.html',
  styleUrls: ['./sel-item.component.css']
})
export class SelItemComponent implements OnInit {
  javClass: string;
  javSlot: number;
  type: string;  // weap, gear, comp, sigils
  slot: number;  // item slot number
  typeLongName: string;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  items: any[];
  longNames = { weap: 'Weapon', gear: 'Gear', comp: 'Component', supp: 'Support', sigils: 'Sigils' };

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store
  ) { }

  ngOnInit() {
    this.javClass = this.store.snapshot().javelins.selected.javClass;
    this.javSlot = this.store.snapshot().javelins.selected.javSlot;
    if (this.type === 'sigils') {
      this.items = [
        { id: -1, name: 'Empty', inscs: [] },
        ...this.store.snapshot().javelins.itemDb.sigils
      ];
    } else {
      this.items = [
        { id: -1, name: 'Empty', inscs: [] },
        ...this.store.snapshot().javelins.savedItems[this.type]
          .filter((item: Item) => this.javClass ? item.class === this.javClass || item.class === 'universal' : true)
          .filter((item: Item) => this.slot !== null ? this.type !== 'gear' || item.slot === this.slot : true)
          .sort((a, b) => (a.name > b.name) ? 1 : -1)
      ];
    }
    this.typeLongName = this.longNames[this.type];
  }

  public search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => term === '' ? this.items
        : this.items.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1))
    );
  }

  public formatter = (x: { name: string }) => x.name;

  public changeItem(evt: any) {
    this.store.dispatch(new SetJavItem(this.type, this.slot, evt.item));
    this.activeModal.close();
  }
}
