import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UserOrder } from 'src/models/user-order.model';

@Component({
  selector: 'app-order-user',
  templateUrl: './order-user.component.html',
  styleUrls: ['./order-user.component.css']
})
export class OrderUserComponent implements OnInit {

  @Input() user: UserOrder = null;

  constructor() { }

  ngOnInit(): void {
  }
}
