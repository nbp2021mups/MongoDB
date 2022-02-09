import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { BookBasic } from "src/models/book-basic.model";
import { BookFull } from "src/models/book-full.model";
import { DrustvenaIgraFull } from "src/models/drustvenaIgra-full.model";
import { PrivezakFull } from "src/models/privezak-full.model";
import { ProductBasic } from "src/models/product-basic.model";
import { RanacFull } from "src/models/ranac-full.model";
import { SlagalicaFull } from "src/models/slagalica-full.model";
import { SveskaFull } from "src/models/sveska-full.model";

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
                        prod.kategorija, prod.autor, prod.zanr, prod.poreklo));
                } else {
                    ret.push(new ProductBasic(prod._id, prod.naziv, prod.proizvodjac, prod.kolicina, prod.cena, prod.slika, prod.kategorija, prod.poreklo));
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
                    knjiga.slika, knjiga.kategorija, knjiga.autor, knjiga.zanr, knjiga.poreklo));
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
                        prod.kategorija, prod.autor, prod.zanr, prod.poreklo));
                } else {
                    ret.push(new ProductBasic(prod._id, prod.naziv, prod.proizvodjac, prod.kolicina, prod.cena, prod.slika, prod.kategorija, prod.poreklo));
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
                    knjiga.slika, knjiga.kategorija, knjiga.autor, knjiga.zanr, knjiga.poreklo));
            });
            return ret;
        }));
    }


    addProduct(productData: FormData){
        console.log(productData.get('cena'))
        return this.http.post<any>("http://localhost:3000/products", productData);
    }

    getProductById(id: String){
      return this.http.get<any>('http://localhost:3000/products/'+id).pipe(map(response=>{
        const id= response._id;
        const kategorija= response.kategorija;
        const naziv = response.naziv;
        const proizvodjac= response.proizvodjac;
        const kolicina=response.kolicina;
        const cena =response.cena;
        const slika = response.slika;
        const opis = response.opis;
        if (kategorija=='knjiga'){
          return new BookFull(id, naziv, proizvodjac, kolicina, cena, slika
            , kategorija, opis, response.poreklo, response.autor, response.zanr, response.brojStrana, response.isbn, response.izdata, null);
        }
        else if (kategorija=='ranac'){
          return new RanacFull(id, naziv, proizvodjac, kolicina, cena, slika
            , kategorija, opis, response.poreklo, response.pol);
        }
        else if (kategorija=='privezak'){
          return new PrivezakFull(id, naziv, proizvodjac, kolicina, cena, slika
            , kategorija, opis, response.poreklo, response.materijal);
        }
        else if (kategorija=='sveska'){
          return new SveskaFull(id, naziv, proizvodjac, kolicina, cena, slika
            , kategorija, opis, response.poreklo, response.format, response.brojListova);
        }
        else if (kategorija=='drustvena igra'){
          return new DrustvenaIgraFull(id, naziv, proizvodjac, kolicina, cena, slika
            , kategorija, opis, response.poreklo, response.trajanje, response.brojIgraca, String(response.uzrastOd)+"-"+String(response.uzrastDo));
        }
        else if (kategorija=='slagalica'){
          return new SlagalicaFull(id, naziv, proizvodjac, kolicina, cena, slika
            , kategorija, opis, response.poreklo, response.dimenzije, response.brojDelova);
        }
      }))
    }

    updateProduct(id:String, formData : FormData){
      return this.http.patch('http://localhost:3000/products/'+id, formData, {responseType: 'text'});

    }

    deleteUserProduct(id:String, image:String, idPorekla: String){
      return this.http.delete('http://localhost:3000/products/'+id+'/user/'+idPorekla,
      {responseType: 'text',
      body:{
        imagePath: image
      }});
    }

    deleteCompanyProduct(id:String, image:String, idPorekla: String){
      return this.http.delete('http://localhost:3000/products/'+id+'/company/'+idPorekla,
      {responseType: 'text',
      body:{
        imagePath: image
      }});
    }

}
