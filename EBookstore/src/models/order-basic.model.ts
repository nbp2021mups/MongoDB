import { ProductBasicSubdocument } from "./product-basic-subdocument.model";

export class OrderBasic {
  public _id: string;
  public cena: number;
  public brojProizvoda: number;
  public proizvodi: Array<ProductBasicSubdocument>;
  public status: {
      potvrdjena: number,
      potvrdili?: Array<String>,
      odbili?: Array<String>,
      naCekanju?: Array<String>,
      celaNarudzbina?: string
  };
  public korisnik: string;
  public kompanija: string;
  public datum: Date;
  public kategorija: string;

  public constructor(_id?: string,
    cena?: number,
    brojProizvoda?: number,
    status?: {
      potvrdjena: number,
      potvrdili?: Array<String>,
      odbili?: Array<String>,
      naCekanju?: Array<String>,
      celaNarudzbina?: string
    },
    kompanija?: string,
    korisnik?: string,
    datum?: Date,
    kategorija?: string,
    proizvodi: Array<ProductBasicSubdocument> = new Array<ProductBasicSubdocument>())
    {
      this._id = _id;
      this.cena = cena;
      this.brojProizvoda = brojProizvoda;
      this.status = status;
      this.kompanija = kompanija;
      this.korisnik = korisnik;
      this.proizvodi = proizvodi;
      this.datum = datum;
      this.kategorija = kategorija;
  }
}
