import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelItemComponent } from '../sel-item/sel-item.component';


@Component({
  selector: 'app-equipped',
  templateUrl: './equipped.component.html',
  styleUrls: ['./equipped.component.css']
})
export class EquippedComponent {
  @Input() javClass: string;
  @Input() javSlot: number;

  constructor(
    public modalService: NgbModal
  ) { }

  selItem(evt: Event): void {
    const type = evt[0];
    const slot = evt[1];
    const modalRef = this.modalService.open(SelItemComponent);
    modalRef.componentInstance.javClass = this.javClass;
    modalRef.componentInstance.javSlot = this.javSlot;
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.slot = slot;
  }

}
