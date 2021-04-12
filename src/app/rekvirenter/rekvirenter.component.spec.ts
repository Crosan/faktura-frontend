import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParsingComponent } from './parsing.component';

describe('ParsingComponent', () => {
  let component: ParsingComponent;
  let fixture: ComponentFixture<ParsingComponent>;

  beforeEach(waitForAsync(() => {
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
