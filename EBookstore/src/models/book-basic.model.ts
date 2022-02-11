import { ProductBasic } from "./product-basic.model"

export class BookBasic extends ProductBasic{

    public autor: string;
    public zanr: string;

    constructor(_id?: string, naziv?: string, proizvodjac?: string, kolicina?: number, cena?: number,
        slika?: string, kategorija?, autor?: string, zanr?: string, poreklo?) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, poreklo);

        this.autor = autor;
        this.zanr = zanr;
    }
}
