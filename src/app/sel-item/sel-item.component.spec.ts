import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelItemComponent } from './sel-item.component';

describe('SelItemComponent', () => {
  let component: SelItemComponent;
  let fixture: ComponentFixture<SelItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
