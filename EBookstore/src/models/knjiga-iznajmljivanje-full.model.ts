import { ProductFull } from "./product-full.model";

export class KnjigaIznajmljivanjeFull extends ProductFull {
    public autor: string;
    public zanr: string;
    public brStrana: number;
    public isbn: string;
    public godIzdavanja: number;
    public stanje: string;
    public status: number;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number,
        slika: string, kategorija: string, opis: string, poreklo, autor: string, zanr: string, brStrana: number,
        godIzdavanja: number, stanje: string, status: number) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, opis, poreklo);

        this.autor = autor;
        this.zanr = zanr;
        this.brStrana = brStrana;
        this.godIzdavanja = godIzdavanja;
        this.stanje = stanje;
        this.status = status;
    }

}
