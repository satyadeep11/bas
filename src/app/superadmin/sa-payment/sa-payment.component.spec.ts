import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaPaymentComponent } from './sa-payment.component';

describe('SaPaymentComponent', () => {
  let component: SaPaymentComponent;
  let fixture: ComponentFixture<SaPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
