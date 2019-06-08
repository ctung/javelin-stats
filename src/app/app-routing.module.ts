import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JavelinsComponent } from './javelins/javelins.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  { path: '', component: JavelinsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'callback', component: CallbackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
