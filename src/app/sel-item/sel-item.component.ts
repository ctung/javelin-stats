import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../services/item.service';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { JavelinService } from '../services/javelin.service';
import { Item } from '../classes/item';
import { BehaviorSubject, Observable, Subject, merge } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { CompactJavelin } from '../classes/javelin';


@Component({
  selector: 'app-sel-item',
  templateUrl: './sel-item.component.html',
  styleUrls: ['./sel-item.component.css']
})
export class SelItemComponent implements OnInit {
  type: string;  // weap, gear, comp, sigils
  slot: number;  // item slot number
  jav: BehaviorSubject<CompactJavelin>;
  typeLongName: string;
  model: any;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  items: any[];
  longNames = { weap: 'Weapon', gear: 'Gear', comp: 'Component', supp: 'Support', sigils: 'Sigils' };

  constructor(
    private itemService: ItemService,
    public activeModal: NgbActiveModal,
    private javelinService: JavelinService
  ) { }

  ngOnInit() {
    if (this.type === 'sigils') {
      this.items = [
        { id: -1, name: 'Empty', inscs: [] },
        ...this.itemService.getSigils()
      ];
    } else {
      this.itemService.getSavedItems(this.type, this.jav.value.class, this.slot).subscribe(i => {
        this.items = [
          { id: -1, name: 'Empty', inscs: [] },
          ...i
        ];
      });
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

  public changeItem(evt: Item) {
    evt.id = +evt.id;
    this.javelinService.updateItem(this.jav, this.type, this.slot, evt);
    this.activeModal.close();
  }
}
