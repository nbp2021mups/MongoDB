import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UserInfo } from 'src/models/user-info.model';

@Component({
  selector: 'app-order-user',
  templateUrl: './order-user.component.html',
  styleUrls: ['./order-user.component.css']
})
export class OrderUserComponent implements OnInit {

  @Input() user: UserInfo = null;

  constructor() { }

  ngOnInit(): void {
  }
}
