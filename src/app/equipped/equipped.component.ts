import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelItemComponent } from '../sel-item/sel-item.component';
import { CompactJavelin } from '../classes/javelin';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-equipped',
  templateUrl: './equipped.component.html',
  styleUrls: ['./equipped.component.css']
})
export class EquippedComponent {
  @Input() jav: BehaviorSubject<CompactJavelin>;

  constructor(
    public modalService: NgbModal,
  ) {  }

  selItem(evt: Event): void {
    const type = evt[0];
    const slot = evt[1];
    const modalRef = this.modalService.open(SelItemComponent);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.slot = slot;
    modalRef.componentInstance.jav = this.jav;
  }

}
