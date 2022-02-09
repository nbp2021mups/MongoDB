export class UserOrder {
  public _id: string;
  public ime: string;
  public prezime: string;
  public adresa: string;
  public email: string;
  public telefon: string;

  public constructor(_id?: string, ime?: string, prezime?: string, adresa?: string, email?: string, telefon?: string) {
    this._id = _id;
    this.ime = ime;
    this.prezime = prezime;
    this.adresa = adresa;
    this.email = email;
    this.telefon = telefon;
  }
}
