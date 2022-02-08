import { ProductFull } from "./product-full.model";

export class DrustvenaIgraFull extends ProductFull {

    public trajanje: number;
    public brIgraca: number;
    public uzrast: string;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number, 
        slika: string, kategorija: string, opis: string, poreklo, trajanje: number, brIgraca: number, uzrast: string) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija, poreklo, opis);

        this.trajanje = trajanje;
        this.brIgraca = brIgraca;
        this.uzrast = uzrast;
    }
}