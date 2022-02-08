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
  public hasMore: boolean = false;
  public count: number = 2;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore():void{
    this.http
    .get('http://localhost:3000/companies/search', {
      params: {
        ['skip']: this.bookstores.length,
        ['count']: this.count,
        ['filter']: '{}',
        ['select']: '_id pib naziv telefon email ponudjeniProizvodi slika',
      },
    })
    .subscribe((data: { poruka: string; sadrzaj: Array<Bookstore> }) => {
      console.log(data);
      this.bookstores = [...this.bookstores, ...data.sadrzaj];
      this.hasMore = data.sadrzaj.length == this.count;
      console.log(this.bookstores);
    });
  }
}
