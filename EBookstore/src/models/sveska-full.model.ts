import { ProductFull } from "./product-full.model";

export class SveskaFull extends ProductFull {
    public format: string;
    public brListova: number;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number,
        slika: string, kategorija: string, opis: string, poreklo, format: string, brListova: number) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, opis, poreklo);
        this.format = format;
        this.brListova = brListova;
    }
}
