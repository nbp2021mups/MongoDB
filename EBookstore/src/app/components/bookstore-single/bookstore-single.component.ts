import { Component, Input, OnInit } from '@angular/core';
import { Bookstore } from 'src/app/models/bookstore/Bookstore';

@Component({
  selector: 'app-bookstore-single',
  templateUrl: './bookstore-single.component.html',
  styleUrls: ['./bookstore-single.component.css'],
})
export class BookstoreSingleComponent implements OnInit {
  @Input() bookstore: Bookstore;
  constructor() {}

  ngOnInit(): void {
  }

  getGrammarly(value: number): string {
    if (value == 0) return 'nema proizvoda';
    return value + ' ' + (value == 1 ? 'proizvod' : 'proizvoda');
  }
}
