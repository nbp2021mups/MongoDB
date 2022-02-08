export class Bookstore {
  public _id: string;
  public pib: string;
  public username: string;
  public lozinka: string;
  public naziv: string;
  public email: string;
  public telefon: string;
  public slika: string;
  public ponudjeniProizvodi: Array<string>;

  public constructor(
    id: string,
    pib: string,
    username: string,
    lozinka: string,
    naziv: string,
    email: string,
    telefon: string,
    slika: string,
    ponudjeniProizvodi: Array<string>
  ) {
    this._id = id;
    this.pib = pib;
    this.username = username;
    this.lozinka = lozinka;
    this.naziv = naziv;
    this.email = email;
    this.telefon = telefon;
    this.slika = slika;
    this.ponudjeniProizvodi = ponudjeniProizvodi;
  }
}
