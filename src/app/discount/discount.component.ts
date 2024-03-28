import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Discount } from '../types/discount';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {
  discountUser: Discount| undefined;
  discountGuest: Discount| undefined;
  constructor(private userService: UserService, private apiService: ApiService) {}

  get isLogged(): boolean {
    return this.userService.isLogged;
  }
  ngOnInit(): void {
    this.apiService.getDiscountUser().subscribe((data: Discount | undefined) => {
      console.log(data);
      this.discountUser = data;
    });
    this.apiService.getDiscountGuest().subscribe((data: Discount | undefined) => {
      console.log(data);
      this.discountGuest = data;
    });
}
}
