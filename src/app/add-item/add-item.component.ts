import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../classes/item';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { Inscription } from '../classes/inscription';
import { AddItem } from '../jav.state';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  type: string;
  itemDetails: Item;
  typeLongName: string;
  items: Item[];
  inscs: Inscription[];
  item: Item;
  longNames = { weap: 'Weapon', gear: 'Gear', comp: 'Component', supp: 'Support', sigils: 'Sigils' };
  mode: string;

  itemModel: any;
  inscModel: any[];
  inscVals: number[];

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store
  ) { }

  ngOnInit() {
    this.typeLongName = this.longNames[this.type];

    this.items = JSON.parse(JSON.stringify(this.store.snapshot().javelins.itemDb[this.type]))
      .sort((a, b) => (a.name > b.name) ? 1 : -1)
      .map((e: Item) => { e.text = e.name; return e; });

    this.inscs = JSON.parse(JSON.stringify(this.store.snapshot().javelins.inscs))
      .filter(i => i.deprecated !== true)
      .map(i => { i.text = i.type + ' ' + i.stat.replace('(blank)', ''); return i; })
      .sort((a, b) => (a.text > b.text) ? 1 : -1);

    if (this.itemDetails) {
      // initialize all the fields if we're doing an edit
      this.mode = 'Edit';
      this.item = JSON.parse(JSON.stringify(this.itemDetails));
    } else {
      // initialize item and inscription pulldowns
      this.mode = 'Add';
      this.item = new Item(this.type);
    }

  }

  searchItem = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.items.filter(v => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1)
      )
    )


  searchInscs = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => this.inscs.filter(v => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1)
      )
    )

  formatter = (x: { text: string }) => x.text;

  toggleScope(insc: Inscription) {
    insc.scope = insc.scope ? 0 : 1;
    insc.png = (insc.scope === 0) ? 'gear.png' : 'jav.png';
  }

  // when the user selects a new inscription name
  changeInsc(evt: any, insc: Inscription) {
    const newInsc = this.inscs.find(obj => obj.id === evt.item.id);
    delete newInsc.value;
    delete newInsc.scope;
    delete newInsc.png;
    insc = Object.assign(insc, newInsc);
  }

  // when the user selects a new item name in the form
  changeItem(evt: any) {
    delete evt.item.inscs;
    this.item = Object.assign(this.item, evt.item);
  }

  addItem() {
    this.item.inscs = this.item.inscs.filter(i => i.id !== null);
    this.store.dispatch(new AddItem(this.type, this.item));
    this.activeModal.close();
  }

}

