import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FakturaPdfComponent } from './faktura-pdf.component';

describe('FakturaPdfComponent', () => {
  let component: FakturaPdfComponent;
  let fixture: ComponentFixture<FakturaPdfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FakturaPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FakturaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
