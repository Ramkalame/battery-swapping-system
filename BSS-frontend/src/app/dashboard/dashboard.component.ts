import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiResponse, User } from '../models/User';
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
  private timeoutId2!: any;
  private bsSubscription1!: Subscription;
  private bsSubscription2!: Subscription;
  private bsSubscription3!: Subscription;
  private bsSubscription4!: Subscription;
  private bsSubscription5!: Subscription;
  private bsSubscription6!: Subscription;
  private userDetailsSubscription!: Subscription;
  private emptyBoxSubscription!: Subscription;

  selectedUser!: User;
  emptyBoxNumber!: number;
  rfId!: string;
  showPopup = false;

  bsData1: boolean = true;
  bsData2: boolean = true;
  bsData3: boolean = true;
  bsData4: boolean = true;
  bsData5: boolean = true;
  bsData6: boolean = true;

  constructor(
    private webSocketService: WebsocketService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Retrieve the rfId parameter from the route
    this.route.params.subscribe((params) => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });
    this.getUserDetails(this.rfId); //call the api to fetch the user details
    this.getCurrentEmptyBox(); //call the api to fetch the current empty box number

    //subscribing for tm Data
    this.subscribeToBox1Bs();
    this.subscribeToBox2Bs();
    this.subscribeToBox3Bs();
    this.subscribeToBox4Bs();
    this.subscribeToBox5Bs();
    this.subscribeToBox6Bs();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutId);
    this.bsSubscription1?.unsubscribe();
    this.bsSubscription2?.unsubscribe();
    this.bsSubscription3?.unsubscribe();
    this.bsSubscription4?.unsubscribe();
    this.bsSubscription5?.unsubscribe();
    this.bsSubscription6?.unsubscribe();
    this.userDetailsSubscription?.unsubscribe();
    this.emptyBoxSubscription?.unsubscribe();
  }

  getUserDetails(rfId: string) {
    this.userDetailsSubscription = this.apiService.getUserById(rfId).subscribe({
      next: (response: ApiResponse<User>) => {
        this.selectedUser = response.data;
        this.timeoutId = setTimeout(() => {
          this.openPopup();
        }, 5000);
      },
      error: (error: any) => {
        console.log('Something Went Wrong');
      },
    });
  }


  getCurrentEmptyBox() {
    this.emptyBoxSubscription = this.apiService.getCurrentEmptyBox().subscribe({
      next: (response: ApiResponse<EmptyBox>) => {
        console.log(response.message + ' :-' + response.data.boxNumber);
        this.emptyBoxNumber = response.data.boxNumber;
      },
      error: (error: any) => {
        console.log('Something Went Wrong');
      },
    });
  }


  // Subscribe to Box 1 Battery Status sensor
  subscribeToBox1Bs() {
    this.bsSubscription1 =  this.webSocketService
      .subscribeToBatteryStatusTopic('01')
      .subscribe((response) => {
        console.log('Received Box 1 Battery Status response:', response);
        if (response === '0') {
          this.bsData1 = true;
        } else {
          this.bsData1 = false;
        }
      });
  }

  //Subscribe to Box2 Battery Status Sensor
  subscribeToBox2Bs() {
    this.bsSubscription2 = this.webSocketService
      .subscribeToBatteryStatusTopic('02')
      .subscribe((response) => {
        console.log('Received Box 2 Battery Status response:', response);
        if (response === '0') {
          this.bsData2 = true;
        } else {
          this.bsData2 = false;
        }
      });
  }

  //Subscribe to Box3 Battery Status Sensor
  subscribeToBox3Bs() {
    this.bsSubscription3 = this.webSocketService
      .subscribeToBatteryStatusTopic('03')
      .subscribe((response) => {
        console.log('Received Box 3 Battery Status response:', response);
        if (response === '0') {
          this.bsData3 = true;
        } else {
          this.bsData3 = false;
        }
      });
  }


  // Subscribe to Box 4 Battery Status sensor
  subscribeToBox4Bs() {
    this.bsSubscription4 = this.webSocketService
      .subscribeToBatteryStatusTopic('04')
      .subscribe((response) => {
        console.log('Received Box 4 Battery Status response:', response);
        if (response === '0') {
          this.bsData4 = true;
        } else {
          this.bsData4 = false;
        }
      });
  }

  // Subscribe to Box 5 Battery Status sensor
  subscribeToBox5Bs() {
    this.bsSubscription5 = this.webSocketService
      .subscribeToBatteryStatusTopic('05')
      .subscribe((response) => {
        console.log('Received Box 5 Battery Status response:', response);
        if (response === '0') {
          this.bsData5 = true;
        } else {
          this.bsData5 = false;
        }
      });
  }

  // Subscribe to Box 6 Battery Status sensor
  subscribeToBox6Bs() {
    this.bsSubscription6 = this.webSocketService
      .subscribeToBatteryStatusTopic('06')
      .subscribe((response) => {
        console.log('Received Box 6 Battery Status response:', response);
        if (response === '0') {
          this.bsData6 = true;
        } else {
          this.bsData6 = false;
        }
      });
  }

  openPopup(): void {
    this.showPopup = true;
    console.log('popup button trigger'); // Show the popup
  }

  closePopup(): void {
    this.showPopup = false; // Hide the popup
  }
}
