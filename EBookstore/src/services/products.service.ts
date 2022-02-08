import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { BookBasic } from "src/models/book-basic.model";
import { ProductBasic } from "src/models/product-basic.model";

@Injectable({providedIn: 'root'})
export class ProductsService {

    constructor(private http: HttpClient) {}

    ucitajProizvode(skip: number, count: number) {
        return this.http.get<any>('http://localhost:3000/products/search', {
            params: {
                skip: skip,
                count: count,
                filter: '{}',
                select: '_id naziv proizvodjac cena slika kolicina kategorija autor zanr poreklo'
            }
        }).pipe(map(response => {
            const products = response.sadrzaj;
            const ret: ProductBasic[] = [];
            products.forEach(prod => {
                if(prod.kategorija == 'knjiga') {
                    ret.push(new BookBasic(prod._id, prod.naziv, prod.proizvodjac, prod.kolicina, prod.cena, prod.slika,
                        prod.kategorija, prod.autor, prod.zanr, prod.poreklo.id));
                } else {
                    ret.push(new ProductBasic(prod._id, prod.naziv, prod.proizvodjac, prod.kolicina, prod.cena, prod.slika, prod.kategorija, prod.poreklo.id));
                }
            });
            return ret;
        }));
    }




    ucitajKnjige(skip: number, count: number){
        return this.http.get<any>('http://localhost:3000/products/search', {
            params: {
                skip: skip,
                count: count,
                filter: '{"kategorija" : "knjiga"}',
                select: '_id naziv proizvodjac cena slika kolicina kategorija autor zanr poreklo'
            }
        }).pipe(map(response => {
            const knjige = response.sadrzaj;
            const ret = [];
            knjige.forEach(knjiga => {
                ret.push(new BookBasic(knjiga._id, knjiga.naziv, knjiga.proizvodjac, knjiga.kolicina, knjiga.cena,
                    knjiga.slika, knjiga.kategorija, knjiga.autor, knjiga.zanr, knjiga.poreklo.id));
            });
            return ret;
        }));
    }


    

    ucitajProizvodeKnjizare(idKnjizare: string, skip: number, count: number) {
        return this.http.get<any>('http://localhost:3000/products/search', {
            params: {
                skip: skip,
                count: count,
                filter: '{"poreklo.id" : "' + idKnjizare + '"}',
                select: '_id naziv proizvodjac cena slika kolicina kategorija autor zanr poreklo'
            }
        }).pipe(map(response => {
            console.log(response);
            const products = response.sadrzaj;
            const ret: ProductBasic[] = [];
            products.forEach(prod => {
                if(prod.kategorija == 'knjiga') {
                    ret.push(new BookBasic(prod._id, prod.naziv, prod.proizvodjac, prod.kolicina, prod.cena, prod.slika,
                        prod.kategorija, prod.autor, prod.zanr, prod.poreklo.id));
                } else {
                    ret.push(new ProductBasic(prod._id, prod.naziv, prod.proizvodjac, prod.kolicina, prod.cena, prod.slika, prod.kategorija, prod.poreklo.id));
                }
            });
            return ret;
        }));
    }




    ucitajKnjigeKnjizare(idKnjizare: string, skip: number, count: number) {
        return this.http.get<any>('http://localhost:3000/products/search', {
            params: {
                skip: skip,
                count: count,
                filter: '{"poreklo.id" : "' + idKnjizare + '", "kategorija" : "knjiga"}',
                select: '_id naziv proizvodjac cena slika kolicina kategorija autor zanr poreklo'
            }
        }).pipe(map(response => {
            const knjige = response.sadrzaj;
            const ret = [];
            knjige.forEach(knjiga => {
                ret.push(new BookBasic(knjiga._id, knjiga.naziv, knjiga.proizvodjac, knjiga.kolicina, knjiga.cena,
                    knjiga.slika, knjiga.kategorija, knjiga.autor, knjiga.zanr, knjiga.poreklo.id));
            });
            return ret;
        }));
    }
}