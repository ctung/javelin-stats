import { Injectable } from '@angular/core';
import { Item, CompactItem } from '../classes/item';
import { Inscription } from '../classes/inscription';
import { DatabaseService } from '../services/database.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ItemService {
  constructor(
    private db: DatabaseService
  ) { }

  // convert a verbose item to compact form
  public compress(item: Item): CompactItem {
    if (item.id < 0) { return null; }
    const newItem = { id: item.id, i: [], idx: item.idx };
    if (item.type !== 'sigils') {
      const newi = [];
      item.inscs.forEach(i => {
        if (i.id >= 0) {
          newi.push([i.id, i.scope, i.value]);
        }
      });
      newItem.i = newi;
    }
    return newItem;
  }

  // add weapon to localstorage saved weapon list
  public add(type: string, cItem: CompactItem): Observable<CompactItem> {
    return this.db.addSave(type, cItem);
  }

  // delete weapon in localstorage, leaving entry as null
  public del(type: string, idx: number) {
    this.db.delSave(type, idx);
  }

  // get user saved items and expand them
  public getSavedItems(type: string, javClass: string, slot: number): Observable<Item[]> {
   return this.db.saved.pipe(
      map(r => r[type]),
      map((cItems: CompactItem[]) => cItems.map(cItem => this.expand(type, cItem))),
      map((Items: Item[]) => Items.filter((i: Item) => javClass ? i.class === javClass || i.class === 'universal' : true)),
      map((Items: Item[]) => Items.filter((i: Item) => slot !== null ? type !== 'gear' || i.slot === slot : true)),
      map((Items: Item[]) => Items.map((i: Item) => { i.text = i.name; return i; })),
      map((Items: Item[]) => Items.sort((a, b) => (a.name > b.name) ? 1 : -1))
      );
  }

  public getSigils(): Item[] {
    const retval = this.db.itemDb.sigils
      .map(i => ({ id: i.id, i: [] }))
      .map((cItem: CompactItem) => this.expand('sigils', cItem))
      .map((i: Item) => { i.text = i.name; return i; });
    return retval;
  }

  // expand item and inscriptions
  public expand(type: string, cItem: CompactItem): Item {
    if (cItem == null) {
      return new Item(type);
    } else {
      const item = Object.assign({}, this.db.itemDb[type].find((i: Item) => i.id === cItem.id));
      item.inscs = cItem.i.map(i => this.expandOneInsc(i));
      item.itype = type;
      item.idx = cItem.idx;

      // add buffs
      if (item.buff) {
        // console.log(item);
        item.bactive = (cItem.bactive == null) ? true : cItem.bactive;
        item.buffDetails = [];
        [0, 1].forEach(i => {
          const itype = `btype${i}`;
          const istat = `bstat${i}`;
          const ivalue = `bvalue${i}`;
          const iscope = `bscope${i}`;
          if (item[itype] && item[istat] && item[ivalue]) {
            item.buffDetails.push({
              id: -1,
              type: item[itype],
              value: item[ivalue],
              stat: item[istat],
              scope: (item[iscope] === 'jav') ? 1 : 0,
              png: (item[iscope] === 'jav') ? './assets/jav.png' : './assets/gear.png',
            });
          }
        });
      }


      // add component base inscriptions
      if (type === 'comp' || type === 'sigils' || type === 'weap') {
        [0, 1, 2, 3].forEach(i => {
          const itype = `type${i}`;
          const istat = `stat${i}`;
          const ivalue = `value${i}`;
          const iscope =  `scope${i}`;
          if (item[itype] && item[istat] && item[ivalue]) {
            item.inscs.push({
              id: -1, type: item[itype],
              value: item[ivalue],
              stat: item[istat],
              scope: (item[iscope] === 'jav') ? 1 : 0,
              png: (item[iscope] === 'jav') ? './assets/jav.png' : './assets/gear.png',
            });
          }
        });
      }
      return item;
    }
  }

  // expand verbosity of one inscription
  // compact inscription is [id, scope, value]
  public expandOneInsc(insc: number[]): Inscription {
    const retval = Object.assign({}, this.db.inscDb.find(i => i.id === insc[0]));
    retval.scope = insc[1];
    retval.value = insc[2];
    retval.png = (insc[1]) ? './assets/jav.png' : './assets/gear.png';
    return retval;
  }

  public initStats(): any {
    const stats = {
      jav: {},
      weap: [{}, {}],
      gear: [{}, {}],
      comp: [{}, {}, {}, {}, {}, {}],
      supp: [{}]
    };
    this.db.inscDb.forEach(i => {
      this.initStat(stats.jav, i);
      [0, 1].forEach(j => this.initStat(stats.weap[j], i));
      [0, 1].forEach(j => this.initStat(stats.gear[j], i));
      [0, 1, 2, 3, 4, 5].forEach(j => this.initStat(stats.comp[j], i));
      this.initStat(stats.supp[0], i);
    });
    return stats;
  }

  private initStat(k, i) {
    if (!(i.type in k)) { k[i.type] = {}; }
    k[i.type][i.stat || ''] = 0;
  }

}
