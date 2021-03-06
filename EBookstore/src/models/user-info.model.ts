export class UserInfo {
  public _id: string;
  public id: string;
  public ime: string;
  public prezime: string;
  public adresa: string;
  public email: string;
  public telefon: string;

  public constructor(_id?: string, id?: string, ime?: string, prezime?: string, adresa?: string, email?: string, telefon?: string) {
    this._id = _id;
    this.id = id;
    this.ime = ime;
    this.prezime = prezime;
    this.adresa = adresa;
    this.email = email;
    this.telefon = telefon;
  }
}
