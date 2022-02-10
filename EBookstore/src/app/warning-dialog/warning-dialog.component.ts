import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent implements OnInit {

  potvrdna : string='';
  pitanje : string ='';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any) {
      if(data){
      this.pitanje=data.pitanje;
      this.potvrdna=data.potvrdna;
    }
  }
  ngOnInit(){}

}
