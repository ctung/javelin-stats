import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navbarOpen = false;
  modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    public auth: AuthService
  ) { }

  login(): void {
    this.auth.login();
  }

  openModal(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
