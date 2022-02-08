import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bookstore } from 'src/app/models/bookstore/Bookstore';

@Component({
  selector: 'app-bookstore-single',
  templateUrl: './bookstore-single.component.html',
  styleUrls: ['./bookstore-single.component.css'],
})
export class BookstoreSingleComponent implements OnInit {
  @Input() bookstore: Bookstore;
  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  getGrammarly(value: number): string {
    if (value == 0) return 'nema proizvoda';
    return value + ' ' + (value == 1 ? 'proizvod' : 'proizvoda');
  }

  onKnjizaraClicked() {
    this.router.navigate(['/proizvodi', this.bookstore._id]);
  }
}
