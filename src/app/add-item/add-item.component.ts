import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../services/item.service';
import { DatabaseService } from '../services/database.service';
import { CompactItem, Item } from '../classes/item';
import { take } from 'rxjs/operators';
import { JavelinService } from '../services/javelin.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  type: string;
  typeLongName: string;
  items: any[];
  item: CompactItem;
  itemDetails: Item;
  scopes: any[];
  inscOptions = {
    placeholder: 'Inscription',
    theme: 'bootstrap',
    width: '220px'
  };
  itemOptions = { placeholder: 'Select Item' };
  inscRange: number[];
  longNames = { 'weap': 'Weapon', 'gear': 'Gear', 'comp': 'Component', 'supp': 'Support', 'sigils': 'Sigils' };
  mode: string;
  inscs: any[];

  constructor(
    private itemService: ItemService,
    private db: DatabaseService,
    public activeModal: NgbActiveModal,
    private javelinService: JavelinService
  ) {
    this.mode = 'Add';
    this.scopes = [
      { id: 1, img: '../assets/jav.png' },
      { id: 1, img: '../assets/jav.png' },
      { id: 1, img: '../assets/jav.png' },
      { id: 1, img: '../assets/jav.png' }
    ];
  }

  ngOnInit() {
    this.typeLongName = this.longNames[this.type];
    this.items = this.db.itemDb[this.type]
      .sort((a, b) => (a.name > b.name) ? 1 : -1)
      .map((e: Item) => { e.text = e.name; return e; });
    this.items.unshift({ id: '', text: '', search: '', hidden: true });

    this.inscs = [];
    [0, 1, 2, 3].forEach(j => {
      this.inscs[j] = this.db.inscDb
        .filter(i => i.deprecated !== true)
        .map(i => ({ id: i.id, text: i.type + ' ' + i.stat.replace('(blank)', '') }))
        .sort((a, b) => (a.text > b.text) ? 1 : -1);
      this.inscs[j].unshift({ id: '', text: '', search: '', hidden: true });
    });

    if (this.type === 'comp') {
      this.inscRange = [0, 1];
    } else {
      this.inscRange = [0, 1, 2, 3];
    }

    // initialize item and inscription pulldowns
    this.item = { idx: -1, id: -1, i: [] };
    this.inscRange.forEach(() => {
      this.item.i.push([]);
    });

    // unselect everything if we're adding an item
    if (this.itemDetails == null) {
      this.items.forEach((i: any) => delete i.selected);
      this.item.id = this.items[0].id;
      this.inscRange.forEach(i => {
        this.inscs[i].forEach(e => delete e.selected);
      });
    }

    // initialize all the fields if we're doing an edit
    if (this.itemDetails) {
      this.mode = 'Edit';
      this.item.idx = this.itemDetails.idx;
      this.items.forEach((i: any) => {
        if (i.id === this.itemDetails.id) { i.selected = 'selected'; }
        this.item.id = this.itemDetails.id;
      });
      for (let i = 0; i < this.itemDetails.inscs.length; i++) {
        const insc = this.itemDetails.inscs[i];
        this.setScope(i, insc.scope);
        this.inscs[i].forEach(s => {
          if (s.id === insc.id) { s.selected = 'selected'; }
        });
        this.item.i[i] = [insc.id, insc.scope, insc.value];
      }
    }

  }

  toggleScope(i: number) {
    this.scopes[i].id = (this.scopes[i].id) ? 0 : 1;
    this.scopes[i].img = (this.scopes[i].id === 0) ? '../assets/gear.png' : '../assets/jav.png';
    this.item.i[i][1] = this.scopes[i].id;
  }
  setScope(i: number, scope: number) {
    this.scopes[i].id = scope;
    this.scopes[i].img = (this.scopes[i].id === 0) ? '../assets/gear.png' : '../assets/jav.png';
    this.item.i[i][1] = this.scopes[i].id;
  }

  addItem() {
    const newInscs = [];
    this.item.i.forEach(i => { if (i.length > 0) { newInscs.push(i); } });
    this.item.i = newInscs;
    this.itemService.add(this.type, this.item).pipe(take(1))
      .subscribe(d => this.javelinService.updateJavItems(this.type, d));
    this.activeModal.close();
  }

  changeInsc(evt: any, slot: number) {
    this.item.i[slot][0] = +evt.id;
    this.item.i[slot][1] = this.scopes[slot].id;
  }

  changeItem(evt: any) {
    this.item.id = +evt.id;
  }

}

