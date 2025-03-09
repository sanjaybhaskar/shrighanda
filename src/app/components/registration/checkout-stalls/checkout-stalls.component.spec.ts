import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStallsComponent } from './checkout-stalls.component';

describe('CheckoutComponent', () => {
  let component: CheckoutStallsComponent;
  let fixture: ComponentFixture<CheckoutStallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutStallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutStallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
