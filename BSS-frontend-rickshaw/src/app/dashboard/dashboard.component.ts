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
  private emptyBoxSubscription!: Subscription;
  private batteryStatusSubscription!: Subscription;

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
    //to get the current empty box number on page load
    this.getCurrentEmptyBox(); 
    //to fetch the all battery status on the page load
    this.getAllBatteryStatus();
  }

  ngOnDestroy(): void {
    //destroy all the set interval and unsubscribe the subscription on the page destroy
    clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutId);
    this.userDetailsSubscription?.unsubscribe();
    this.emptyBoxSubscription?.unsubscribe();
    this.batteryStatusSubscription?.unsubscribe();
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

  //to fetch the last updated empty box from the databse
  getCurrentEmptyBox() {
    this.emptyBoxSubscription = this.apiService.getCurrentEmptyBox().subscribe({
      next: (response: ApiResponse<EmptyBox>) => {
        console.log(response.message + ' :-' + response.data.boxNumber);
        //assign the empty box number to the variable
        this.emptyBoxNumber = response.data.boxNumber;
      },
      error: (error: any) => {
        console.log('Something Went Wrong');
      },
    });
  }

  //to fetch the battery status for all the databases
  getAllBatteryStatus() {
    this.batteryStatusSubscription = this.apiService
      .getAllBatteryStatus()
      .subscribe({
        next: (response: ApiResponse<BatteryStatus[]>) => {
          //assign the fetched data to the variable
          this.bsArray = response.data;
          console.log(response.data);
          //call the assign method to respectively assign the the battery status data to box wise.
          this.assign();
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }

  //loop the battery status array and assign the data to the respective variable
  assign() {
    this.bsArray.forEach((batteryStatus, index) => {
      if (batteryStatus.id === 'b1') {
        this.bsData1 = batteryStatus.status;
      } else if (batteryStatus.id === 'b2') {
        this.bsData2 = batteryStatus.status;
      } else if (batteryStatus.id === 'b3') {
        this.bsData3 = batteryStatus.status;
      } else if (batteryStatus.id === 'b4') {
        this.bsData4 = batteryStatus.status;
      } else if (batteryStatus.id === 'b5') {
        this.bsData5 = batteryStatus.status;
      } else if (batteryStatus.id === 'b6') {
        this.bsData6 = batteryStatus.status;
      } else if (batteryStatus.id === 'b7') {
        this.bsData7 = batteryStatus.status;
      } else if (batteryStatus.id === 'b8') {
        this.bsData8 = batteryStatus.status;
      } else if (batteryStatus.id === 'b9') {
        this.bsData9 = batteryStatus.status;
      } else if (batteryStatus.id === 'b10') {
        this.bsData10 = batteryStatus.status;
      }
    });
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
