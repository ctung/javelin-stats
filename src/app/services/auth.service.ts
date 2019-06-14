import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { environment } from 'src/environments/environment';
import Secrets from '../../secrets.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private secrets: any = Secrets;

  auth0 = new auth0.WebAuth({
    clientID: this.secrets.clientID,
    domain: this.secrets.domain,
    responseType: 'token id_token',
    redirectUri: environment.callback_url,
    scope: 'openid email',
    audience: environment.rest_api,
    prompt: 'none',
  });

  constructor(
    public router: Router
  ) {
  }

  get accessToken(): string {
    return localStorage.getItem('access_token');
  }

  get idToken(): string {
    return localStorage.getItem('id_token');
  }

  get email(): string {
    return localStorage.getItem('email');
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        // this.db.initDb(true); // re-init the saved item database after login
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('email', authResult.idTokenPayload.email);
  }



  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('email');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return localStorage.getItem('access_token') && Date.now() < parseInt(localStorage.getItem('expires_at'), 10);
  }


}
