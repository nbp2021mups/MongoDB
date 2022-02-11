export class ProductBasic {
    public _id: string;
    public naziv: string;
    public proizvodjac: string;
    public kolicina: number;
    public cena: number;
    public slika: string;   //putanja do slike na serveru
    public kategorija: string;
    public poreklo: {id: string, ime?: string, prezime?: string, naziv?: string};

    constructor(_id: string, naziv: string, proizvodjac: string, kolicina: number, cena: number, slika: string, kategorija: string, poreklo) {
        this._id = _id;
        this.naziv = naziv;
        this.proizvodjac = proizvodjac;
        this.kolicina = kolicina;
        this.cena = cena;
        this.slika = slika;
        this.kategorija = kategorija;
        if(kategorija == 'knjiga na izdavanje') {
            this.poreklo = {id: poreklo.id, ime: poreklo.ime, prezime: poreklo.prezime};
        } else {
            this.poreklo = {id: poreklo.id, naziv: poreklo.naziv};
        }
    }
}
