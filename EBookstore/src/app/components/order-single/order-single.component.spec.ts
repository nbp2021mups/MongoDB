import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSingleComponent } from './order-single.component';

describe('OrderSingleComponent', () => {
  let component: OrderSingleComponent;
  let fixture: ComponentFixture<OrderSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
