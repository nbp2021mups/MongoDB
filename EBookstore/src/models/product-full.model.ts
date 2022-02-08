import { ProductBasic } from "./product-basic.model";

export class ProductFull extends ProductBasic {
    public opis: string;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number, 
        slika: string, kategorija: string, opis: string, poreklo) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, poreklo);
        this.opis = opis;
    }
}