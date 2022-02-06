import { ProductBasic } from "./product-basic.model";

export class ProductFull extends ProductBasic {
    public opis: string;
    public poreklo: {_idPorekla: string, ime?: string, prezime?: string, naziv?: string};

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number, 
        slika: string, kategorija: string, opis: string, poreklo) {

        super(_id, naziv, proizvodjac, kolicina, cena, slika, kategorija);
        this.opis = opis;
        if(kategorija == 'knjiga-za-iznajmljivanje') {
            this.poreklo = {_idPorekla: poreklo._idPorekla, ime: poreklo.ime, prezime: poreklo.prezime};
        } else {
            this.poreklo = {_idPorekla: poreklo._idPorekla, naziv: poreklo.naziv};
        }
    }
}