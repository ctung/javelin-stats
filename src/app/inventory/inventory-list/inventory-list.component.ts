import { Component, OnChanges, Input } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../classes/item';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemComponent } from '../../add-item/add-item.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnChanges {
  @Input() type: string;
  items: Observable<Item[]>;
  constructor(
    private itemService: ItemService,
    public modalService: NgbModal
    ) { }

  ngOnChanges() {
    this.items = this.itemService.filterSavedItems(this.type, null, null);
  }

  delete(id: number) {
    this.itemService.del(this.type, id);
  }

  edit(item: Item) {
    const modalRef = this.modalService.open(AddItemComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.type = this.type;
    modalRef.componentInstance.itemDetails = item;
  }

}
