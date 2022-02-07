export class ProductBasicSubdocument{
    public id: string;
    public naziv: string;
    public cena: number;
    public slika: string;
    public kolicina: number;
    public proizvodjac: string;
    public kategorija: string;
    public poreklo: { naziv?: string, id?: string };

    constructor(id: string, naziv: string, cena: number, slika: string, kolicina: number, proizvodjac: string,  kategorija: string, poreklo: { naziv?: string, id?: string } = {}) {
        this.id = id;
        this.naziv = naziv;
        this.cena = cena;
        this.slika = slika;
        this.kolicina = kolicina;
        this.proizvodjac = proizvodjac;
        this.kategorija = kategorija;
        this.poreklo = poreklo;
    }
}
