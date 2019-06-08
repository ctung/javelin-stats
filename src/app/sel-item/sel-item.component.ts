import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JavelinService } from '../services/javelin.service';
import { Inscription } from '../classes/inscription';
import { Item } from '../classes/item';
import { BehaviorSubject } from 'rxjs';
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

  items: any[];
  itemOptions: any;
  longNames = { 'weap': 'Weapon', 'gear': 'Gear', 'comp': 'Component', 'supp': 'Support', 'sigils': 'Sigils' };

  constructor(
    private itemService: ItemService,
    public activeModal: NgbActiveModal,
    private javelinService: JavelinService
  ) { }

  ngOnInit() {
    if (this.type === 'sigils') {
      this.items = [
        { id: '', text: '', selected: 'selected', search: '', hidden: true, inscs: [] },
        { id: -1, name: 'Empty', inscs: [] },
          ...this.itemService.getSigils()
      ];
      console.log(this.items);
    } else {
      this.itemService.getSavedItems(this.type, this.jav.value.class, this.slot).subscribe(i => {
        this.items = [
          { id: '', text: '', selected: 'selected', search: '', hidden: true, inscs: [] },
          { id: -1, name: 'Empty', inscs: [] },
          ...i
        ];
      });
    }

    this.typeLongName = this.longNames[this.type];

    this.itemOptions = {
      placeholder: 'Select ' + this.typeLongName,
      escapeMarkup: function (markup: string) { return markup; },
      templateResult: (item: Item) => this.itemTemplate(item),
      templateSelection: function (item: Item) { return item.name; }
    };
  }

  public itemTemplate(item: any): string {
    if ('disabled' in item && item.disabled === true) { return ''; }
    let s = `<h5>${item.name}</h5><div class="row">`;
    item.inscs.forEach((i: Inscription) => {
      if (i.value != null && i.type != null) {
        s += `<div class="col-6 px-3 inscText">`;
        s += `<img src='../../assets/${(i.scope ? 'jav' : 'gear')}.png' />`;
        s += ` ${i.value || ''}% ${i.type || ''} ${i.stat || ''}</div>`;
      }
    });
    s += `</div>`;
    return s;
  }

  public changeItem(evt: Item) {
    evt.id = +evt.id;
    // console.log([evt, this.slot]);
    this.javelinService.updateItem(this.jav, this.type, this.slot, evt);
    this.activeModal.close();
  }
}
