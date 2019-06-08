import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JavelinsComponent } from './javelins/javelins.component';
import { StatsComponent } from './stats/stats.component';
import { EquippedComponent } from './equipped/equipped.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemComponent } from './item/item.component';
import { SelItemComponent } from './sel-item/sel-item.component';
import { ItemService } from './services/item.service';
import { BasicStatComponent } from './stats/basic-stat/basic-stat.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './services/auth.service';
import { CallbackComponent } from './callback/callback.component';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    JavelinsComponent,
    StatsComponent,
    EquippedComponent,
    AddItemComponent,
    ItemComponent,
    SelItemComponent,
    BasicStatComponent,
    InventoryComponent,
    InventoryListComponent,
    PrivacyComponent,
    NavbarComponent,
    FooterComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
  ],
  entryComponents: [
    AddItemComponent,
    SelItemComponent,
    InventoryListComponent
  ],
  providers: [
    ItemService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
