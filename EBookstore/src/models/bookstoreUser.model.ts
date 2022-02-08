import { User } from "./user.model";

export class BookstoreUser extends User {
    public naziv: string;

    constructor(id: string, username: string, role: string, token: string, exp: Date, naziv: string) {
        super(id, username, role, token, exp);

        this.naziv = naziv;
    }
}