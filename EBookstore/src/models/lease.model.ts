import { BookBasic } from "./book-basic.model";
import { UserInfo } from "./user-info.model";

export class Lease {
  public _id: string;
  public knjiga: BookBasic;
  public korisnikZajmi: UserInfo;
  public korisnikPozajmljuje: UserInfo;
  public odDatuma: Date;
  public doDatuma: Date;
  public potvrdjeno: number;
  public cena: number;

  public constructor(_id?: string, knjiga?: BookBasic, korisnikPozajmljuje?: UserInfo, korisnikZajmi?: UserInfo, odDatuma?: Date, doDatuma?: Date, potvrdjeno?: number, cena?: number) {
    this._id = _id;
    this.knjiga = knjiga;
    this.korisnikZajmi = korisnikZajmi;
    this.korisnikPozajmljuje = korisnikPozajmljuje;
    this.odDatuma = odDatuma;
    this.doDatuma = doDatuma;
    this.potvrdjeno = potvrdjeno;
    this.cena = cena;
  }
}
