export class Bookstore {
  public pib: string;
  public username: string;
  public lozinka: string;
  public naziv: string;
  public email: string;
  public telefon: string;
  public ponudjeniProizvodi: Array<string>;

  public constructor(
    pib: string,
    username: string,
    lozinka: string,
    naziv: string,
    email: string,
    telefon: string,
    ponudjeniProizvodi: Array<string>
  ) {
    this.pib = pib;
    this.username = username;
    this.lozinka = lozinka;
    this.naziv = naziv;
    this.email = email;
    this.telefon = telefon;
    this.ponudjeniProizvodi = ponudjeniProizvodi;
  }
}
