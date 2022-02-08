import { ProductFull } from "./product-full.model";

export class SlagalicaFull extends ProductFull {
    public dimenzije: string;
    public brDelova: number;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number,
        slika: string, kategorija: string, opis: string, poreklo, dimenzije: string, brDelova: number) {
            super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, opis, poreklo);

            this.dimenzije = dimenzije;
            this.brDelova = brDelova;
        }
}
