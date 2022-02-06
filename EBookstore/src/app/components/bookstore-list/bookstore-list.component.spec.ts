import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookstoreListComponent } from './bookstore-list.component';

describe('BookstoreListComponent', () => {
  let component: BookstoreListComponent;
  let fixture: ComponentFixture<BookstoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookstoreListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookstoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
