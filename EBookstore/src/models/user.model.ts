
export class User {
    public id: string;
    public username: string;
    public role: string;
    private _token: string;
    private _tokenExpDate: Date;
  
    constructor(id: string, username: string, role: string, token: string, exp: Date) {
      this.id = id;
      this.username = username;
      this.role = role;
      this._token = token;
      this._tokenExpDate = exp;
    }
  
    get token() {
      if (!this._token || !this._tokenExpDate || this._tokenExpDate < new Date()) {
        return null;
      }
      return this._token;
    }
  }