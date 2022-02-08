import { ProductFull } from "./product-full.model";

export class PrivezakFull extends ProductFull {
    public materijal: string;


    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number,
        slika: string, kategorija: string, opis: string, poreklo, materijal: string) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, opis, poreklo);
        this.materijal = materijal;
    }
}
