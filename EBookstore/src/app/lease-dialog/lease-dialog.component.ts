import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lease-dialog',
  templateUrl: './lease-dialog.component.html',
  styleUrls: ['./lease-dialog.component.css']
})
export class LeaseDialogComponent implements OnInit {


  potvrdna : string='';
  odDatuma: Date =null;
  doDatuma : Date=null;
  cena: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data){
      this.potvrdna=data.potvrdna;
    }
  }


  ngOnInit(){


  }



}
