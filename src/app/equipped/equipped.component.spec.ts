import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquippedComponent } from './equipped.component';

describe('EquippedComponent', () => {
  let component: EquippedComponent;
  let fixture: ComponentFixture<EquippedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquippedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
