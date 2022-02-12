import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookBasic } from 'src/models/book-basic.model';
import { Lease } from 'src/models/lease.model';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-lease',
  templateUrl: './lease.component.html',
  styleUrls: ['./lease.component.css']
})
export class LeaseComponent implements OnInit {

  public loggedUser: User = null;

  public selectedIndex: number = 1;
  public count: number = 5;

  public booksForLease: Array<BookBasic> = new Array<BookBasic>();
  public leasedBooks: Array<Lease> = new Array<Lease>();
  public leaseRequests: Array<Lease> = new Array<Lease>();
  public myLeased: Array<Lease> = new Array<Lease>();

  public hasMoreBooksForLease: boolean = false;
  public hasMoreLeasedBooks: boolean = false;
  public hasMoreLeaseRequests: boolean = false;
  public hasMoreMyLeased: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (user) => {
        this.loggedUser = user;
        this.loadBooksForLease(true);
      },
      error: err => console.log(err)
    }).unsubscribe();
  }

  setSelected(value: number): void {
    this.selectedIndex = value;
    switch(value) {
      case(1):
        this.loadBooksForLease(true);
      break;
      case(2):
        this.loadLeasedBooks(true);
      break;
      case(3):
        this.loadLeaseRequests(true);
      break;
      case(4):
        this.loadMyLeased(true);
      break;
    }
  }

  loadBooksForLease(reload: boolean = false): void {
    this.http.get('http://localhost:3000/leases/offered/' + this.loggedUser.id, {
      params: {
        ['limit']: this.count,
        ['skip']: reload ? 0 : this.booksForLease.length,
        ['sort']: JSON.stringify({ date: -1 }),
        ['select']: 'naziv proizvodjac autor zanr slika cena poreklo'
      }
    }).subscribe({
        next: (data: { poruka: string, sadrzaj: Array<BookBasic> }) => {
          if(reload)
            this.booksForLease = data.sadrzaj;
          else
            this.booksForLease = [...this.booksForLease, ...data.sadrzaj];
          this.hasMoreBooksForLease = this.count == data.sadrzaj.length;
        },
        error: err => console.log(err)
    });
  }

  loadLeasedBooks(reload: boolean = false): void {
    this.http.get('http://localhost:3000/leases/leased', {
      params: {
        ['filter']: JSON.stringify({ "korisnikZajmi.id": this.loggedUser.id, potvrdjeno: 1 }),
        ['limit']: this.count,
        ['skip']: reload ? 0 : this.leasedBooks.length,
        ['sort']: JSON.stringify({ date: -1 }),
        ['select']: "korisnikPozajmljuje knjiga odDatuma doDatuma potvrdjeno cena"
      }
    }).subscribe({
        next: (data: { poruka: string, sadrzaj: Array<Lease> }) => {
          if(reload)
            this.leasedBooks = data.sadrzaj;
          else
            this.leasedBooks = [...this.leasedBooks, ...data.sadrzaj];
          this.hasMoreLeasedBooks = this.count == data.sadrzaj.length;
        },
        error: err => console.log(err)
    });
  }

  loadLeaseRequests(reload: boolean = false): void {
    this.http.get('http://localhost:3000/leases/leased', {
      params: {
        ['filter']: JSON.stringify({
            potvrdjeno: 0,
           "korisnikZajmi.id": this.loggedUser.id
        }),
        ['limit']: this.count,
        ['skip']: reload ? 0 : this.leaseRequests.length,
        ['sort']: JSON.stringify({ cena: -1 }),
        ['select']: "korisnikPozajmljuje knjiga odDatuma doDatuma potvrdjeno cena"
      }
    }).subscribe({
        next: (data: { poruka: string, sadrzaj: Array<Lease> }) => {
          if(reload)
            this.leaseRequests = data.sadrzaj;
          else
            this.leaseRequests = [...this.leaseRequests, ...data.sadrzaj];
          this.hasMoreLeaseRequests = this.count == data.sadrzaj.length;
        },
        error: err => console.log(err)
    });
  }

  loadMyLeased(reload: boolean = false): void {
    this.http.get('http://localhost:3000/leases/leased', {
      params: {
        ['filter']: JSON.stringify({ "korisnikPozajmljuje.id": this.loggedUser.id  }),
        ['limit']: this.count,
        ['skip']: reload ? 0 : this.myLeased.length,
        ['sort']: JSON.stringify({ date: -1 }),
        ['select']: "korisnikZajmi knjiga odDatuma doDatuma potvrdjeno cena"
      }
    }).subscribe({
        next: (data: { poruka: string, sadrzaj: Array<Lease> }) => {
          if(reload)
            this.myLeased = data.sadrzaj;
          else
            this.myLeased = [...this.myLeased, ...data.sadrzaj];
          this.hasMoreMyLeased = this.count == data.sadrzaj.length;
        },
        error: err => console.log(err)
    });
  }

  leaseResponse(response:number, ind: number)
  {
    const dialog = this.matDialog.open(LoadingDialogComponent);

    this.http.patch('http://localhost:3000/leases/response', {
      leaseID: this.leaseRequests[ind]._id,
      response
    }).subscribe({
        next: _ => {
          this.leaseRequests = this.leaseRequests.filter((el, index) => index != ind);
          dialog.componentInstance.response('Uspešno!', true);
        },
        error: err => {
          console.log(err);
          dialog.componentInstance.response(err.error.sadrzaj, false);
        }
    });
  }

  onObrisanaKnjiga(id){
    const index= this.booksForLease.findIndex(knjiga=>{
      return knjiga._id==id;
    })
    if(index!=-1)
      this.booksForLease.splice(index,1);
  }
}
