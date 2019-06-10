import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../services/item.service';
import { DatabaseService } from '../services/database.service';
import { CompactItem, Item } from '../classes/item';
import { take, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JavelinService } from '../services/javelin.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  inscRange: number[];
  longNames = { weap: 'Weapon', gear: 'Gear', comp: 'Component', supp: 'Support', sigils: 'Sigils' };
  mode: string;
  inscs: any[];

  itemModel: any;
  inscModel: any[];
  inscVals: number[];

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
    this.inscModel = [null, null, null, null];
    this.inscVals = [null, null, null, null];
  }

  ngOnInit() {
    this.typeLongName = this.longNames[this.type];

    this.items = this.db.itemDb[this.type]
      .sort((a, b) => (a.name > b.name) ? 1 : -1)
      .map((e: Item) => { e.text = e.name; return e; });

    this.inscs = this.db.inscDb
      .filter(i => i.deprecated !== true)
      .map(i => ({ id: i.id, text: i.type + ' ' + i.stat.replace('(blank)', '') }))
      .sort((a, b) => (a.text > b.text) ? 1 : -1);


    if (this.type === 'comp') {
      this.inscRange = [0, 1];
    } else {
      this.inscRange = [0, 1, 2, 3];
    }

    // initialize item and inscription pulldowns
    this.item = { idx: -1, id: null, i: [] };
    this.inscRange.forEach(() => {
      this.item.i.push([]);
    });

    // initialize all the fields if we're doing an edit
    if (this.itemDetails) {
      this.mode = 'Edit';
      this.item.idx = this.itemDetails.idx;
      this.itemModel = Object.assign({}, this.itemDetails);

      for (let i = 0; i < this.itemDetails.inscs.length; i++) {
        const insc = this.itemDetails.inscs[i];
        // console.log(insc);
        this.setScope(i, insc.scope);
        this.inscModel[i] = { id: insc.id, text: insc.type + ' ' + insc.stat.replace('(blank)', '') };
        this.inscVals[i] = insc.value;
      }
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

  public formatter = (x: { text: string }) => x.text;

  setScope(i: number, scope: number) {
    this.scopes[i].id = scope;
    this.scopes[i].img = (this.scopes[i].id === 0) ? '../assets/gear.png' : '../assets/jav.png';
  }
  toggleScope(i: number) {
    this.setScope(i, this.scopes[i].id ? 0 : 1);
  }

  addItem() {
    this.item.id = this.itemModel.id;
    const newInscs = [];
    this.inscRange.forEach(i => {
      if (this.inscModel[i] !== null && this.inscVals[i] != null) {
        newInscs.push([this.inscModel[i].id, this.scopes[i].id, this.inscVals[i]]);
      }
    });
    this.item.i = newInscs;
    this.itemService.add(this.type, this.item).pipe(take(1))
      .subscribe(d => this.javelinService.updateJavItems(this.type, d));
    this.activeModal.close();
  }

}

