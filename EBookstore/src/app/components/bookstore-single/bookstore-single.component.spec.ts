import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookstoreSingleComponent } from './bookstore-single.component';

describe('BookstoreSingleComponent', () => {
  let component: BookstoreSingleComponent;
  let fixture: ComponentFixture<BookstoreSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookstoreSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookstoreSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
