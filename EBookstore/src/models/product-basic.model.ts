export class ProductBasic {
    public _id: string;
    public naziv: string;
    public proizvodjac: string;
    public kolicina: number;
    public cena: number;
    public slika: string;   //putanja do slike na serveru
    public kategorija: string;

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number, slika: string, kategorija: string) {
        this._id = _id;
        this.naziv = naziv;
        this.proizvodjac = proizvodjac;
        this.kolicina = kolicina;
        this.cena = cena;
        this.slika = slika;
        this.kategorija = kategorija;
    }
}