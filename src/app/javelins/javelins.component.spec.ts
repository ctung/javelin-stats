import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JavelinsComponent } from './javelins.component';

describe('JavelinsComponent', () => {
  let component: JavelinsComponent;
  let fixture: ComponentFixture<JavelinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JavelinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JavelinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
