import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class LeasesService{

  constructor(private http: HttpClient) {}

  posaljiZahtevZaInzajmljivanje(bodyReq: Object){
    return this.http.post("http://localhost:3000/leases", bodyReq);
  }

  otkaziZahtevZaInzajmljivanje(idKjige : string, idKorisnika : string){
    return this.http.delete("http://localhost:3000/leases/"+idKorisnika+"/"+idKjige);
  }

}
