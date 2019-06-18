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
        if (i.id >= 0 && i.id !== null) {
          newi.push([i.id, i.scope, i.value]);
        }
      });
      newItem.i = newi;
    }
    return newItem;
  }

  public addItem(type: string, item: Item): Observable<number> {
    return this.db.addItem(type, this.compress(item));
  }

  // delete weapon in localstorage, leaving entry as null
  public delItem(idx: number) {
    this.db.delSave(idx);
  }

  public getSavedItems(): Observable<any> {
    return this.db.getSavedItems().pipe(
      map(r => {
        Object.keys(r).forEach(type => {
          r[type] = r[type].map(cItem => this.expand(type, cItem));
        });
        return r;
      })
    );
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
      item.cItem = cItem;

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
              png: (item[iscope] === 'jav') ? 'jav.png' : 'gear.png',
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
          const iscope = `scope${i}`;
          if (item[itype] && item[istat] && item[ivalue]) {
            item.inscs.push({
              id: -1, type: item[itype],
              value: item[ivalue],
              stat: item[istat],
              scope: (item[iscope] === 'jav') ? 1 : 0,
              png: (item[iscope] === 'jav') ? 'jav.png' : 'gear.png',
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
    retval.png = (insc[1]) ? 'jav.png' : 'gear.png';
    return retval;
  }

}
