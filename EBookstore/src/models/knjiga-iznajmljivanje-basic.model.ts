import { BookBasic } from "./book-basic.model";

export class KnjigaIznajmljivanjeBasic extends BookBasic {
    public izdataDo: string;
    public stanje: string;
    public status: number;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number,
        slika: string, kategorija: string, poreklo, autor: string, zanr: string, izdataDo: string, stanje: string, status: number) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, autor, zanr, poreklo);

        this.izdataDo = izdataDo;
        this.stanje = stanje;
        this.status = status;
    }

}
