import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lease-dialog',
  templateUrl: './lease-dialog.component.html',
  styleUrls: ['./lease-dialog.component.css']
})
export class LeaseDialogComponent implements OnInit {

  potvrdna : string='';
  datumDo : Date;
  cena: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any) {
      if(data){
      this.potvrdna=data.potvrdna;
    }
  }
  ngOnInit(){}

}
