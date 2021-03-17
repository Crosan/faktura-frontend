import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsingComponent } from './parsing.component';

describe('ParsingComponent', () => {
  let component: ParsingComponent;
  let fixture: ComponentFixture<ParsingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParsingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParsingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
