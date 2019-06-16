import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelItemComponent } from '../sel-item/sel-item.component';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-equipped',
  templateUrl: './equipped.component.html',
  styleUrls: ['./equipped.component.css']
})
export class EquippedComponent {
  public javClass$: Observable<string>;

  constructor(
    public modalService: NgbModal,
    public store: Store
  ) {
    this.javClass$ = this.store.select(state => state.javelins.selected.javClass);
  }

  selItem(evt: Event): void {
    const type = evt[0];
    const slot = evt[1];
    const modalRef = this.modalService.open(SelItemComponent);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.slot = slot;
  }

}
