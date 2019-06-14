import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { AuthService } from './services/auth.service';
import { Store } from '@ngxs/store';
import { GetSavedItems } from './jav.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'javelin-stats';

  constructor(
    private db: DatabaseService,
    public auth: AuthService,
    private store: Store
  ) {
    auth.handleAuthentication();
    // this.db.initDb(this.auth.isAuthenticated());

  }

  ngOnInit() {
    this.db.initDb(this.auth.isAuthenticated());
    this.store.dispatch(new GetSavedItems());
  }
}
