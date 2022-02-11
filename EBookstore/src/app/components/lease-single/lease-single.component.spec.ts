import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseSingleComponent } from './lease-single.component';

describe('LeaseSingleComponent', () => {
  let component: LeaseSingleComponent;
  let fixture: ComponentFixture<LeaseSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
