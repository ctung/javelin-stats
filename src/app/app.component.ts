import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'javelin-stats';

  constructor(
    private db: DatabaseService,
    public auth: AuthService
  ) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    this.db.initDb(this.auth.isAuthenticated());
    if (this.auth.isAuthenticated()) {
      // this.auth.renewTokens();
    }
  }
}
