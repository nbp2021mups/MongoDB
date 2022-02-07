import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class BooksService {

    constructor(private http: HttpClient) {}

    ucitajKnjige(skip: number, limit: number){
        return this.http.get<any>('http://localhost:3000/books/search', {
            params: {
                
            }
        }).pipe(map(response => {
            
        }));
    }
}