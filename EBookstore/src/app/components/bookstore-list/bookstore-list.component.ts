import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Bookstore } from 'src/app/models/bookstore/Bookstore';

@Component({
  selector: 'app-bookstore-list',
  templateUrl: './bookstore-list.component.html',
  styleUrls: ['./bookstore-list.component.css'],
})
export class BookstoreListComponent implements OnInit {
  public bookstores: Array<Bookstore> = new Array<Bookstore>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get('http://localhost:3000/companies/search', {
        params: {
          ['skip']: 0,
          ['count']: 10,
          ['filter']: '{}',
          ['select']: 'pib naziv telefon email ponudjeniProizvodi',
        },
      })
      .subscribe((data: { poruka: string; sadrzaj: Array<Bookstore> }) => {
        this.bookstores = data.sadrzaj;
      });
  }
}
