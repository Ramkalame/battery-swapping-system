import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiResponse, Customer, BatteryStatus, Status } from '../models/User';
import { ApiService } from '../services/api.service';
import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InsertingAnimationComponent } from '../popups/inserting-animation/inserting-animation.component';
import { EmptyBox } from '../models/BatteryTransaction';
import { TestAnimationComponent } from '../test-animation/test-animation.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    InsertingAnimationComponent,
    TestAnimationComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('batterySwapAnimation', [
      state(
        'closed',
        style({
          transform: 'scale(1)',
          opacity: 1,
        })
      ),
      state(
        'open',
        style({
          transform: 'scale(0.8)',
        })
      ),
      transition('closed <=> open', [animate('1s ease-in-out')]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  Status = Status;

  //var to remove after component destruction
  private timeoutId!: any;
  private userDetailsSubscription!: Subscription;

  //to store the user details
  customer!: Customer;
  //to store the current empty box number
  emptyBoxNumber!: number;
  //to store the rfid
  rfId!: string;
  //to open and close the popup
  showPopup = false;
  //to store the battery status fetched from database
  batteryState: BatteryStatus[] = [];

  constructor(
    private webSocketService: WebsocketService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the rfId parameter from the route
    this.route.params.subscribe((params) => {
      this.rfId = params['rfId'];
      console.log('rfid in the dashboard component');
    });
    sessionStorage.setItem('rfId',this.rfId)
    const storedBatteryState = localStorage.getItem('batteryState');

    if (storedBatteryState) {
      this.batteryState = JSON.parse(storedBatteryState);
      console.log(
        'Loaded Battery Status from localStorage:',
        this.batteryState
      );
    }
    //to get the user details on the page load
    this.getUserDetails(this.rfId);
  }

  ngOnDestroy(): void {
    //destroy all the set interval and unsubscribe the subscription on the page destroy
    clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutId);
    this.userDetailsSubscription?.unsubscribe();
  }

  //Fetch user details from the database by id
  getUserDetails(rfId: string) {
    this.userDetailsSubscription = this.apiService.getUserById(rfId).subscribe({
      next: (response: any) => {
        //assign the fetched response to the selected user var
        this.customer = response.data;
        //after 5 seconds delay open the popup
        this.timeoutId = setTimeout(() => {
          this.openPopup();
        }, 5000);
      },
      error: (error: any) => {
        //if any error navigate to the invalid credentials page
        this.router.navigate(['/invalid-credential']);
        console.log('Something Went Wrong');
      },
    });
  }

  getBatteryStatusImage(status: Status): string {
    switch (status) {
      case Status.EMPTY:
        return './assets/empty-battery.png'; // Path to "empty" battery image
      case Status.CHARGING:
        return './assets/charging-battery.png'; // Path to "charging" battery image
      case Status.FULL_CHARGED:
        return './assets/charged-battery.png'; // Path to "full" battery image
      default:
        return './assets/empty-battery.png'; // Default to empty if unknown status
    }
  }

  // Show the popup
  openPopup(): void {
    this.showPopup = true;
    console.log('popup button trigger');
  }

  //close the popup
  closePopup(): void {
    this.showPopup = false;
  }
}
