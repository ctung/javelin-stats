import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
// import { AuthService } from 'angularx-social-login';
// import { FacebookLoginProvider } from 'angularx-social-login';
// import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;
  modalRef: NgbModalRef;
  // public user: SocialUser;

  constructor(
    private modalService: NgbModal,
    public auth: AuthService
  ) { }

  ngOnInit() {
    /*
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.modalRef) {
        this.modalRef.close();
      }
      console.log(user);
    });
    */
  }

  login(): void {
    this.auth.login();
  }

  /*
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);

  }

  signOut(): void {
    this.authService.signOut();
  }
  */

  openModal(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
