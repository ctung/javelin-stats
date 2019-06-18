import { Component, OnChanges, Input } from '@angular/core';
import { Item } from '../../classes/item';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemComponent } from '../../add-item/add-item.component';
import { Store } from '@ngxs/store';
import { DelItem } from 'src/app/jav.actions';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnChanges {
  @Input() type: string;
  items$: Observable<Item[]>;
  constructor(
    public modalService: NgbModal,
    private store: Store
    ) { }

  ngOnChanges() {
    this.items$ = this.store.select(state => state.javelins.savedItems[this.type]);
  }

  delete(id: number) {
    this.store.dispatch(new DelItem(this.type, id));
  }

  edit(item: Item) {
    const modalRef = this.modalService.open(AddItemComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.type = this.type;
    modalRef.componentInstance.itemDetails = item;
  }

}
