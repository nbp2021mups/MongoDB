import { ProductBasicSubdocument } from "./product-basic-subdocument.model";

export class OrderBasic {
  public _id: string;
  public cena: number;
  public brojProizvoda: number;
  public proizvodi: Array<ProductBasicSubdocument>;
  public potvrdjena: {
      vrednost: boolean,
      od: Array<String>,
      ukupno: Array<String>
  };
  public korisnik: string;
  public kompanija: string;
  public datum: Date;

  public constructor(_id?: string,
    cena?: number,
    brojProizvoda?: number,
    potvrdjena?: {
        vrednost: boolean,
        od: Array<String>,
        ukupno: Array<String>
    },
    kompanija?: string,
    korisnik?: string,
    datum?: Date,
    proizvodi: Array<ProductBasicSubdocument> = new Array<ProductBasicSubdocument>())
    {
      this._id = _id;
      this.cena = cena;
      this.brojProizvoda = brojProizvoda;
      this.potvrdjena = potvrdjena;
      this.kompanija = kompanija;
      this.korisnik = korisnik;
      this.proizvodi = proizvodi;
      this.datum = datum;
  }
}
