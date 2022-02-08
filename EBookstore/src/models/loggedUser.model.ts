import { User } from "./user.model";

export class LoggedUser extends User {
    public ime: string;
    public prezime: string;

    constructor(id: string, username: string, role: string, token: string, exp: Date, ime: string, prezime: string) {
        super(id, username, role, token, exp);

        this.ime = ime;
        this.prezime = prezime;
    }
}