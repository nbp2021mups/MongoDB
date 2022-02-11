import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookBasic } from 'src/models/book-basic.model';
import { Lease } from 'src/models/lease.model';
import { UserInfo } from 'src/models/user-info.model';

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

  constructor() { }

  ngOnInit(): void {
    if(this.lease != null) {
      this.book = this.lease.knjiga;
      this.user = this.lease.korisnikZajmi ? this.lease.korisnikZajmi : this.lease.korisnikPozajmljuje;
    }
  }

  leaseResponse(value: number): void {
    this.response.emit(value);
  }

}
