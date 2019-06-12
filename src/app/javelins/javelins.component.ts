import { Component, OnInit } from '@angular/core';
import { CompactJavelin } from '../classes/javelin';
import { JavelinService } from '../services/javelin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemComponent } from '../add-item/add-item.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { JavState, JavStateModel } from '../jav.state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-javelins',
  templateUrl: './javelins.component.html',
  styleUrls: ['./javelins.component.css']
})
export class JavelinsComponent implements OnInit {
  public javelins: any;
  private class: string;
  private slot: number;
  public url: string;
  public jav = new BehaviorSubject<CompactJavelin>(null);
  public inventory: boolean;

  @Select(JavState) j$: Observable<string[]>;

  constructor(
    public javelinService: JavelinService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.slot = 0;
    this.javelinService.parseUrl().subscribe(c => {
      this.class = c;
      this.jav.next(this.javelins[this.class][this.slot]);
    });
    this.inventory = false;

    this.javelinService.javelins.subscribe(j => {
      this.javelins = j;
      if (this.class !== null && this.slot !== null && this.class in j && this.slot in j[this.class]) {
        this.jav.next(this.javelins[this.class][this.slot]);
      }
    });

    this.j$.subscribe(f => console.log(f));
  }

  onSelect(c: string, slot: number) {
    this.class = c;
    this.slot = slot;
    this.inventory = false;
    this.jav.next(this.javelins[c][slot]);
  }

  addItem(type: string) {
    const modalRef = this.modalService.open(AddItemComponent, {centered: true, backdrop: 'static' });
    modalRef.componentInstance.type = type;
  }

  getLink(modal: NgbModal) {
    if (this.class && this.slot) {
      this.javelinService.getLink(this.jav).pipe(take(1)).subscribe(url => this.url = url);
      this.modalService.open(modal);
    }
  }

  resetJav(modal: NgbModal) {
    this.modalService.open(modal);
  }

  resetJavConfirm(jav: CompactJavelin) {
    this.javelinService.resetJav(jav);
    this.modalService.dismissAll('');
  }

  resetCache() {
    localStorage.removeItem('items');
    localStorage.removeItem('javelins');
    location.reload();
  }

  toggleInventory() {
    this.inventory = !this.inventory;
  }

}
