import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, empty } from 'rxjs';
import * as jsurl from 'jsurl';
import { environment } from '../../environments/environment';
import { CompactJavelin } from '../classes/javelin';
import { Item, CompactItem } from '../classes/item';
import { ItemService } from '../services/item.service';
import { RouterStateSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DatabaseService } from '../services/database.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class JavelinService {
  public javelins = new BehaviorSubject<any>({});
  private snapshot: RouterStateSnapshot;


  constructor(
    private itemService: ItemService,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private db: DatabaseService
  ) {
    this.snapshot = this.router.routerState.snapshot;
    let tmp = {};
    // load localstore
    const lstore = localStorage.getItem('javelins');
    if (lstore) {
      tmp = JSON.parse(lstore);
    } else {
      // initialize empty javelins
      ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
        tmp[c] = [];
        [1, 2, 3].forEach(i => {
          tmp[c][i] = new CompactJavelin(c, i, 'loadout ' + i);
        });
      });
    }

    if (this.auth.isAuthenticated()) {
      this.http.get(environment.rest_api + '/builds')
        .subscribe(data => {
          if (Object.keys(data).length) {
            tmp = data;
            // console.log(tmp);
          } else {
            // if database is empty, write initialize with localstore
            ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
              [1, 2, 3].forEach(i => {
                this.http.post(environment.rest_api + '/builds', {
                  class: c,
                  slot: i,
                  build: tmp[c][i]
                }).subscribe(res => console.log(res));
              });
            });
          }
          ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
            [1, 2, 3].forEach(i => {
              tmp[c][i].debuffs = { acid: false, beacon: false };
              ['weap', 'gear', 'comp'].forEach(j => tmp[c][i][j].forEach(k => {
                if (k != null) { k.bactive = true; }
              }));
            });
          });
          this.updateJavelins(tmp);
        });
    } else {
      ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
        [1, 2, 3].forEach(i => {
          tmp[c][i].debuffs = { acid: false, beacon: false };
          ['weap', 'gear', 'comp'].forEach(j => tmp[c][i][j].forEach(k => {
            if (k != null) { k.bactive = true; }
          }));
        });
      });
      this.updateJavelins(tmp);
    }
  }

  public getJavelins(): Observable<any> {
    return this.db.getJavelins().pipe(
      map(data => {
        Object.keys(data).forEach(c => {
          data[c] = data[c].map(j => {
            j.debuffs = { acid: false, beacon: false };
            ['weap', 'gear', 'comp'].forEach(t => {
              j[t] = j[t].map(i => this.itemService.expand(t, i));
            });
            return j;
          });
        });
        return data;
      })
    );
  }

  private updateJavelins(tmp: any) {
    const newValue = this.javelins.value;
    ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
      [1, 2, 3].forEach(i => {
        if (!(c in newValue)) { newValue[c] = []; }
        newValue[c][i] = tmp[c][i];
      });
    });
    this.javelins.next(newValue);
  }

  public updateJavItems(type: string, cItem: CompactItem) {
    const newValue = this.javelins.value;
    ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
      [1, 2, 3].forEach(i => {
        newValue[c][i][type] = newValue[c][i][type].map((item: CompactItem) => {
          if (item.idx === cItem.idx) {
            return cItem;
          } else {
            return item;
          }
        });
      });
    });
    this.javelins.next(newValue);
  }

  // make sure to save the minimum data required to reconstruct build
  public save(javs: any): void {
    javs = this.compress(javs);
    if (this.auth.isAuthenticated()) {
      ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
        [1, 2, 3].forEach(i => {
          this.http.post(environment.rest_api + '/builds', {
            class: c,
            slot: i,
            build: javs[c][i]
          }).subscribe({ error: e => console.log(e) });
        });
      });
    }
    localStorage.setItem('javelins', JSON.stringify(javs));
  }

  // strip javs down to minimum for storage and links
  public compress(javs: any): any {
    const tmp = {};
    ['colossus', 'interceptor', 'ranger', 'storm'].forEach(c => {
      tmp[c] = [];
      [1, 2, 3].forEach(i => tmp[c][i] = this.compressOne(javs[c][i]));
    });
    return tmp;
  }

  // strip one jav down to minimum
  public compressOne(jav: CompactJavelin): CompactJavelin {
    const j = new CompactJavelin(jav.class, jav.slot, jav.name);
    delete j.debuffs;
    ['weap', 'gear', 'comp', 'sigils', 'supp'].forEach(t => {
      for (let i = 0; i < jav[t].length; i++) {
        const oldItem = jav[t][i];
        if (oldItem != null) {
          const newItem = { id: oldItem.id, i: [], idx: oldItem.idx };
          if (t !== 'sigils') {
            oldItem.i.forEach(insc => {
              if (insc[0] >= 0) {
                newItem.i.push(Object.assign([], insc));
              }
            });
          }
          j[t][i] = newItem;
        }
      }
    });
    return j;
  }

  public resetJav(jav: CompactJavelin) {
    const newValue = this.javelins.value;
    const c = jav.class;
    const i = jav.slot;
    newValue[c][i] = new CompactJavelin(c, i, 'loadout ' + i);
    newValue[c][i].debuffs = { acid: false, beacon: false };
    ['weap', 'gear', 'comp'].forEach(j => newValue[c][i][j].forEach(k => k.bactive = true));
    this.javelins.next(newValue);
    this.save(newValue);
  }

  public updateItem(jav: BehaviorSubject<CompactJavelin>, type: string, slot: number, item: Item) {
    const newValue = this.javelins.value;
    // console.log([jav.value, type, slot]);
    newValue[jav.value.class][jav.value.slot][type][slot] = this.itemService.compress(item);
    this.javelins.next(newValue);
    this.save(newValue);
  }

  public changeName(jav: BehaviorSubject<CompactJavelin>, name: string) {
    const newValue = this.javelins.value;
    newValue[jav.value.class][jav.value.slot].name = name;
    this.javelins.next(newValue);
    this.save(newValue);
  }

  public getLink(jav: BehaviorSubject<CompactJavelin>): Observable<string> {
    const myJav = this.compressOne(jav.value);
    myJav.slot = 0;
    return this.http.post<any>(environment.rest_api + '/build_link', { build: jsurl.stringify(myJav) }, httpOptions).pipe(
      map(result => {
        const url = environment.base_href + '?id=' + result.id;
        this.copyStringToClipboard(url);
        return url;
      })
    );
  }

  public parseUrl(): Observable<string> {
    if ('build' in this.snapshot.root.queryParams) {
      const newValue = this.javelins.value;
      const jav = jsurl.parse(this.snapshot.root.queryParams.build);
      jav.debuffs = { acid: false, beacon: false };
      if (!(jav.class in newValue)) { newValue[jav.class] = []; }
      newValue[jav.class][0] = jav;
      this.javelins.next(newValue);
      return of(jav.class);
    }
    if ('id' in this.snapshot.root.queryParams) {
      return this.http.get<any>(environment.rest_api + '/build_link/' + this.snapshot.root.queryParams.id).pipe(
        map(result => {
          const newValue = this.javelins.value;
          const jav = jsurl.parse(result.build);
          jav.debuffs = { acid: false, beacon: false };
          if (!(jav.class in newValue)) { newValue[jav.class] = []; }
          newValue[jav.class][0] = jav;
          this.javelins.next(newValue);
          return jav.class;
        }));
    }
    return empty();
  }

  private copyStringToClipboard(str) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = str;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public toggleBuff(jav: BehaviorSubject<CompactJavelin>, type: string, slot: number, value: boolean) {
    const newValue = this.javelins.value;
    newValue[jav.value.class][jav.value.slot][type][slot].bactive = value;
    this.javelins.next(newValue);
  }

  public toggleDebuff(jav: BehaviorSubject<CompactJavelin>, type: string, value: boolean) {
    const newValue = this.javelins.value;
    newValue[jav.value.class][jav.value.slot].debuffs[type] = value;
    this.javelins.next(newValue);
  }

}
