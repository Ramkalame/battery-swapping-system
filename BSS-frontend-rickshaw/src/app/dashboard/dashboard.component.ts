import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiResponse, BatteryStatus, User } from '../models/User';
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

  //var to remove after component destruction
  private timeoutId!: any;
  private userDetailsSubscription!: Subscription;

  // battery status subscription 
  private bsSubscription1!: Subscription;
  private bsSubscription2!: Subscription;
  private bsSubscription3!: Subscription;
  private bsSubscription4!: Subscription;
  private bsSubscription5!: Subscription;
  private bsSubscription6!: Subscription;
  private bsSubscription7!: Subscription;
  private bsSubscription8!: Subscription;
  private bsSubscription9!: Subscription;
  private bsSubscription10!: Subscription;

  //to store the user details
  selectedUser!: User;
  //to store the current empty box number
  emptyBoxNumber!: number;
  //to store the rfid
  rfId!: string;
  //to open and close the popup
  showPopup = false;
  //to store the battery status fetched from database
  bsArray: BatteryStatus[] = [];

  //to store the battery status data for separate box
  bsData1!: number;
  bsData2!: number;
  bsData3!: number;
  bsData4!: number;
  bsData5!: number;
  bsData6!: number;
  bsData7!: number;
  bsData8!: number;
  bsData9!: number;
  bsData10!: number;

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
    });
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
      next: (response: ApiResponse<User>) => {
        //assign the fetched response to the selected user var
        this.selectedUser = response.data;
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


  // Subscribe to battery status
  subscribeToBatteryStatus(): void {
    for (let i = 1; i <= 10; i++) {
      const subscription = this.webSocketService
        .subscribeToBatteryStatusTopic(i.toString())
        .subscribe((status: any) => {
          // Store the battery status in the bsData object
          this.bsData[i] = status;
        });

      // Add the subscription to the list
      this.bsSubscriptions.push(subscription);
    }
  }

  clearSubscriptions(): void {
    // Clear all the subscriptions for battery statuses
    for (let i = 1; i <= 10; i++) {
      this[`bsSubscription${i}`]?.unsubscribe();
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
