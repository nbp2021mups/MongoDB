import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BookBasic } from 'src/models/book-basic.model';
import { Lease } from 'src/models/lease.model';
import { UserInfo } from 'src/models/user-info.model';
import { ProductsService } from 'src/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from 'src/app/warning-dialog/warning-dialog.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-lease-single',
  templateUrl: './lease-single.component.html',
  styleUrls: ['./lease-single.component.css']
})
export class LeaseSingleComponent implements OnInit {

  @Input() book: BookBasic = null;
  @Input() lease: Lease = null;
  @Input() user: UserInfo = null;
  @Output() response: EventEmitter<number> = new EventEmitter<number>();
  @Output() obrisanaKnjiga: EventEmitter<string>=new EventEmitter<string>();

  constructor(private router: Router, private productService : ProductsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    if(this.lease != null) {
      this.book = this.lease.knjiga;
      this.user = this.lease.korisnikZajmi ? this.lease.korisnikZajmi : this.lease.korisnikPozajmljuje;
    }
  }

  leaseResponse(value: number): void {
    this.response.emit(value);
  }

  onDeleteClicked(){
    console.log("cao")
    let dialogWarning= this.dialog.open(WarningDialogComponent,
      { data :
        { pitanje : `Da li ste sigurni da želite da obrišete ovu knjigu?`,
          potvrdna : 'Obriši'}
      });

      dialogWarning.afterClosed().subscribe(result=>{
        if(result=='true'){
          console.log(this.book)
          this.productService.deleteUserProduct(this.book._id, this.book.slika, this.book.poreklo.id).subscribe({
            next: response=>{
              this.obrisanaKnjiga.emit(this.book._id);
            },
            error: err=>{

            }
          });
        }
      })
  }

  onEditClicked(){
    this.router.navigate(['/korisnik/izmena', this.book._id]);
  }

}
