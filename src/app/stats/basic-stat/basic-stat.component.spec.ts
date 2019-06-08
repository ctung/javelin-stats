import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicStatComponent } from './basic-stat.component';

describe('BasicStatComponent', () => {
  let component: BasicStatComponent;
  let fixture: ComponentFixture<BasicStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
