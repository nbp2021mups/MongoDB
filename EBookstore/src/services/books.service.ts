import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class BooksService {

    constructor(private http: HttpClient) {}

}