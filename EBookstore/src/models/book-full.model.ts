import { ProductFull } from "./product-full.model";

export class BookFull extends ProductFull {
    public autor: string;
    public zanr: string;
    public brStrana: number;
    public isbn: string;
    public godIzdavanja: number;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number,
        slika: string, kategorija: string, opis: string, poreklo, autor: string, zanr: string, brStrana: number,
        isbn: string, godIzdavanja: number) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, opis, poreklo);

        this.autor = autor;
        this.zanr = zanr;
        this.brStrana = brStrana;
        this.isbn = isbn;
        this.godIzdavanja = godIzdavanja;
    }

}
