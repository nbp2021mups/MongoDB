import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css']
})
export class LoadingDialogComponent implements OnInit {

  public content : string;
  public loading: boolean = true;
  public result: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: { content: string, loading: boolean }) {
      this.content = this.dialogData?.content ? this.dialogData.content : 'Molimo sačekajte...';
  }
  ngOnInit(){}

  response(content: string, success: boolean): void {
    this.content = content;
    this.result = success ? 1 : -1;
    this.loading = false;
  }

}
