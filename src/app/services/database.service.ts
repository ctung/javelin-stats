import { Injectable } from '@angular/core';
import { Inscription } from '../classes/inscription';
import { CompactItem, Item, Items } from '../classes/item';
import { Javelins } from '../classes/javelin';
import weapons from '../../assets/weapons.json';
import gear from '../../assets/gear.json';
import components from '../../assets/components.json';
import inscriptions from '../../assets/inscriptions.json';
import support from '../../assets/support.json';
import sigils from '../../assets/sigils.json';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public saved = new BehaviorSubject<any>({ weap: [], gear: [], comp: [], supp: [] });
  public itemDb = { weap: weapons, gear, comp: components, supp: support, sigils };
  public inscDb: Inscription[] = inscriptions;
  public baseValues: any;
  public isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.baseValues = {
      colossus: {
        mdmg: 170,
        mstype: 'Physical',
        mtype: 'Kinetic',
        armor: 600,
        shield: 200
      },
      interceptor: {
        mdmg: 25,
        mstype: 'Physical',
        mtype: 'Kinetic',
        armor: 600,
        shield: 200
      },
      ranger: {
        mdmg: 100,
        mstype: 'Elemental',
        mtype: 'Elec',
        armor: 600,
        shield: 200
      },
      storm: {
        mdmg: 150,
        mstype: 'Elemental',
        mtype: 'Fire',
        armor: 600,
        shield: 200
      }
    };
  }

  // add item, return db index
  public addItem(type: string, cItem: CompactItem): Observable<number> {
    if (this.isAuthenticated) {
      return this.http.post(environment.rest_api + '/items', { type, item: cItem }).pipe(
        map((data: CompactItem) => +data.idx)
      );
    }
  }

  // delete item
  public delSave(idx: number) {
    if (this.isAuthenticated) {
      this.http.delete(environment.rest_api + '/items/' + idx).pipe(take(1))
        .subscribe(res => console.log(res));
    }
  }

  private loadDb() {
    if (this.isAuthenticated) {
      this.http.get<any>(environment.rest_api + '/items').subscribe(
        data => {
          if (data.items.length) {
            const newValue = { weap: [], gear: [], comp: [], supp: [] };
            data.items.forEach(i => {
              newValue[i.type].push({ idx: i.idx, id: i.id, i: i.i });
            });
            this.saved.next(newValue);
            localStorage.setItem('items', JSON.stringify(newValue));
          } else {
            // initialize the database
            const items = this.saved.value;
            const streams = [];
            Object.keys(items).map(t => {
              items[t].forEach(i => {
                streams.push(this.http.post(environment.rest_api + '/items', {
                  item: i, type: t, i: i.i, idx: null
                }));
              });
            });
            forkJoin(streams).subscribe({ error: e => console.log(e) });
          }
        }
      );
    }
  }

  private updateDb(type: string, cItem: CompactItem) {
    const items = this.saved.value;
    let found = false;
    items[type] = items[type].map(i => {
      if (i.idx === cItem.idx) {
        found = true;
        return cItem;
      } else {
        return i;
      }
    });
    if (!found) {
      items[type].push(cItem);
    }
    this.saved.next(items);
    localStorage.setItem('items', JSON.stringify(items));
  }

  public initDb(isAuthenticated: boolean) {
    const items = localStorage.getItem('items');
    if (items) {
      this.saved.next(JSON.parse(items));
    }
    this.isAuthenticated = isAuthenticated;
    this.loadDb();
  }

  public getSavedItems(): Observable<any> {
    const items = new Items();
    if (this.auth.isAuthenticated()) {
      return this.http.get<any>(environment.rest_api + '/items').pipe(
        map(data => {
          data.items.forEach(i => {
            items[i.type].push({ idx: i.idx, id: i.id, i: i.i });
          });
          localStorage.setItem('items', JSON.stringify(items));
          return items;
        })
      );
    } else {
      const tmp = localStorage.getItem('items');
      if (tmp) {
        return of(JSON.parse(tmp));
      }
      return of(items);
    }
  }

  public getJavelins(): Observable<any> {
    const javelins = new Javelins();
    if (this.auth.isAuthenticated()) {
      return this.http.get<any>(environment.rest_api + '/builds2').pipe(
        map(data => {
            data.builds.forEach(b => {
              javelins[b.class][b.slot] = b;
            });
            return javelins;
        })
      );
    } else {
      const tmp = localStorage.getItem('builds');
      if (tmp) {
        return of(JSON.parse(tmp));
      }
      return of(javelins);
    }
  }

}
