import { ProductBasicSubdocument } from "src/models/product-basic-subdocument.model";

export class Cart{
  public _id: string;
  public cena: number;
  public brojProizvoda: number;
  public korisnik: string;
  public proizvodi: Array<ProductBasicSubdocument>;

  public constructor(_id?:string, cena?:number, brojProizvoda?:number, korisnik?:string, proizvodi: Array<ProductBasicSubdocument> = new Array<ProductBasicSubdocument>()){
    this._id = _id;
    this.cena = cena;
    this.brojProizvoda = brojProizvoda;
    this.korisnik = korisnik;
    this.proizvodi = proizvodi;
  }
}
