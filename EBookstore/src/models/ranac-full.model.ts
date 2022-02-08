import { ProductFull } from "./product-full.model";

export class RanacFull extends ProductFull {
    public pol: string;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number,
        slika: string, kategorija: string, opis: string, poreklo, pol: string) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, opis, poreklo);
        this.pol = pol;
    }
}
