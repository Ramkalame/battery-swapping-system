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
import { UpdateEBoxService } from '../services/update-e-box.service';

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

  isBatteryInserted: boolean = false;
  isBatteryCharged: boolean = false;
  selectedUser!: User;
  emptyBoxNumber!:number;
  private timeoutId!: any;
  private timeoutId2!: any;
  rfId!: string;
  showPopup = false;

  // For box 1
  // irData1!: boolean;
  tmData1!: string;
  bsData1: boolean = true;
  sdData1: boolean = true;

  // For box 2
  // irData2!: boolean;
  tmData2!: string;
  bsData2: boolean = true;
  sdData2: boolean = true;

  // For box 3
  // irData3!: boolean;
  tmData3!: string;
  bsData3: boolean = true;
  sdData3: boolean = true;

  // For box 4
  // irData4!: boolean;
  tmData4!: string;
  bsData4: boolean = true;
  sdData4: boolean = true;

  // For box 5
  // irData5!: boolean;
  tmData5!: string;
  bsData5: boolean = true;
  sdData5: boolean = true;

  // For box 6
  // irData6!: boolean;
  tmData6!: string;
  bsData6: boolean = true;
  sdData6: boolean = true;

  constructor(
    private webSocketService: WebsocketService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private updateEBoxService:UpdateEBoxService
  ) {}

  ngOnInit(): void {
    // Retrieve the rfId parameter from the route
    this.route.params.subscribe((params) => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });
    this.getUserDetails(this.rfId); //call the api to fetch the user details
    // this.getCurrentEmptyBox(); //call the api to fetch the current empty box number
    // this.subscribeToGetTheNewUpdatedEmptyBox();

    //subscribing for ir Data
    // this.subscribeToBox1Ir();
    // this.subscribeToBox2Ir();
    // this.subscribeToBox3Ir();
    // this.subscribeToBox4Ir();
    // this.subscribeToBox5Ir();
    // this.subscribeToBox6Ir();

    //subscribing for tm Data
    this.subscribeToBox1Bs();
    this.subscribeToBox2Bs();
    this.subscribeToBox3Bs();
    this.subscribeToBox4Bs();
    this.subscribeToBox5Bs();
    this.subscribeToBox6Bs();

    // //subscribing for tm Data
    // this.subscribeToBox1Tm();
    // this.subscribeToBox2Tm();
    // this.subscribeToBox3Tm();
    // this.subscribeToBox4Tm();
    // this.subscribeToBox5Tm();
    // this.subscribeToBox6Tm();

    //subscribing for tm Data
    // this.subscribeToBox1Sd();
    // this.subscribeToBox2Sd();
    // this.subscribeToBox3Sd();
    // this.subscribeToBox4Sd();
    // this.subscribeToBox5Sd();
    // this.subscribeToBox6Sd();
  }

  getUserDetails(rfId: string) {
    this.apiService.getUserById(rfId).subscribe({
      next: (response: ApiResponse<User>) => {
        this.selectedUser = response.data;
        this.timeoutId =  setTimeout(() => {
          this.openPopup();
        }, 5000);
      },
      error: (error: any) => {
        // console.log('Something Went Wrong');
      },
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.timeoutId2) {
      clearTimeout(this.timeoutId);
    }
  }

  // getCurrentEmptyBox() {
  //   this.apiService.getCurrentEmptyBox().subscribe({
  //     next: (response: ApiResponse<EmptyBox>) => {
  //       console.log(response.message + ' :-' + response.data.boxNumber);
  //       this.emptyBoxNumber = response.data.boxNumber;
  //     },
  //     error: (error: any) => {
  //       console.log('Something Went Wrong');
  //     },
  //   });
  // }

  // updateCurrentEmptyBox(boxNumber: number) {
  //   this.apiService.updateCurrentEmptyBox(boxNumber).subscribe({
  //     next: (response: ApiResponse<EmptyBox>) => {
  //       console.log(response.message);
  //      this.closePopup();
  //      console.log('------Closing the dialog-------'+boxNumber);
  //     },
  //     error: (error: any) => {
  //       console.log('Something Went Wrong');
  //     },
  //   });
  // }


  // subscribeToGetTheNewUpdatedEmptyBox(){
  //   this.updateEBoxService.emptyBoxNumber$.subscribe({
  //     next: (boxNumber) => {
  //       console.log('Updated empty box number from service:', boxNumber);
  //       // You can now perform logic based on the updated box number
  //       if (boxNumber !== null) {
  //         this.emptyBoxNumber = boxNumber; // 
  //       }
  //     },
  //     error: (error) => {
  //       console.log('Error receiving updated empty box number:', error);
  //     },
  //   })
  // }

  //method for toggel
  toggleSwapState() {
    // this.irData1 = !this.irData1;
  }

  // Subscribe to Box 1 IR sensor
  // subscribeToBox1Ir() {
  //   this.webSocketService.subscribeToIrTopic('01').subscribe((response) => {
  //     if (response === '0') {
  //       this.irData1 = true;
  //     } else {
  //       this.irData1 = false;
  //     }
  //     console.log('Received Box 1 IR response:', response);
  //   });
  // }

  // Subscribe to Box 1 Temperature sensor
  subscribeToBox1Tm() {
    this.webSocketService
      .subscribeToTemperatureTopic('01')
      .subscribe((response) => {
        // console.log('Received Box 1 Temperature response:', response);
      });
  }

  // Subscribe to Box 1 Battery Status sensor
  subscribeToBox1Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('01')
      .subscribe((response) => {
        // console.log('Received Box 1 Battery Status response:', response);
        if (response === '0') {
          this.bsData1 = true;
        } else {
          this.bsData1 = false;
        }
      });
  }

  // // Subscribe to Box 1 Solenoid sensor
  // subscribeToBox1Sd() {
  //   this.webSocketService
  //     .subscribeToSolenoidTopic('01')
  //     .subscribe((response) => {
  //       console.log('Received Box 1 Solenoid response:', response);
  //     });
  // }

  // // Subscribe to Box 2 IR Sensor
  // subscribeToBox2Ir() {
  //   this.webSocketService.subscribeToIrTopic('02').subscribe((response) => {
  //     console.log('Received Box 2 IR response:', response);
  //   });
  // }

  //Subscribe to Box2 Temperature Sensor
  subscribeToBox2Tm() {
    this.webSocketService
      .subscribeToTemperatureTopic('02')
      .subscribe((response) => {
        // console.log('Received Box 2 Temperature response:', response);
      });
  }

  //Subscribe to Box2 Battery Status Sensor
  subscribeToBox2Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('02')
      .subscribe((response) => {
        // console.log('Received Box 2 Battery Status response:', response);
        if (response === '0') {
          this.bsData2 = true;
        } else {
          this.bsData2 = false;
        }
      });
  }

  // Subscribe to Box 2 Solenoid sensor
  // subscribeToBox2Sd() {
  //   this.webSocketService
  //     .subscribeToSolenoidTopic('02')
  //     .subscribe((response) => {
  //       console.log('Received Box 2 Solenoid response:', response);
  //     });
  // }

  //Subscribe to Box3 IR Sensor
  // subscribeToBox3Ir() {
  //   this.webSocketService.subscribeToIrTopic('03').subscribe((response) => {
  //     console.log('Received Box 3 IR response:', response);
  //   });
  // }

  //Subscribe to Box3 Temperature Sensor
  subscribeToBox3Tm() {
    this.webSocketService
      .subscribeToTemperatureTopic('03')
      .subscribe((response) => {
        // console.log('Received Box 3 Temperature response:', response);
      });
  }

  //Subscribe to Box3 Battery Status Sensor
  subscribeToBox3Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('03')
      .subscribe((response) => {
        // console.log('Received Box 3 Battery Status response:', response);
        if (response === '0') {
          this.bsData3 = true;
        } else {
          this.bsData3 = false;
        }
      });
  }

  //Subscribe to Box3 Solenoid Sensor
  // subscribeToBox3Sd() {
  //   this.webSocketService
  //     .subscribeToSolenoidTopic('03')
  //     .subscribe((response) => {
  //       console.log('Received Box 3 Solenoid response:', response);
  //     });
  // }

  // Subscribe to Box 4 IR sensor
  // subscribeToBox4Ir() {
  //   this.webSocketService.subscribeToIrTopic('04').subscribe((response) => {
  //     console.log('Received Box 4 IR response:', response);
  //   });
  // }

  // Subscribe to Box 4 Temperature sensor
  subscribeToBox4Tm() {
    this.webSocketService
      .subscribeToTemperatureTopic('04')
      .subscribe((response) => {
        // console.log('Received Box 4 Temperature response:', response);
      });
  }

  // Subscribe to Box 4 Battery Status sensor
  subscribeToBox4Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('04')
      .subscribe((response) => {
        // console.log('Received Box 4 Battery Status response:', response);
        if (response === '0') {
          this.bsData4 = true;
        } else {
          this.bsData4 = false;
        }
      });
  }

  // Subscribe to Box 4 Solenoid sensor
  // subscribeToBox4Sd() {
  //   this.webSocketService
  //     .subscribeToSolenoidTopic('04')
  //     .subscribe((response) => {
  //       console.log('Received Box 4 Solenoid response:', response);
  //     });
  // }

  // Subscribe to Box 5 IR sensor
  // subscribeToBox5Ir() {
  //   this.webSocketService.subscribeToIrTopic('05').subscribe((response) => {
  //     console.log('Received Box 5 IR response:', response);
  //   });
  // }

  // Subscribe to Box 5 Temperature sensor
  subscribeToBox5Tm() {
    this.webSocketService
      .subscribeToTemperatureTopic('05')
      .subscribe((response) => {
        // console.log('Received Box 5 Temperature response:', response);
      });
  }

  // Subscribe to Box 5 Battery Status sensor
  subscribeToBox5Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('05')
      .subscribe((response) => {
        // console.log('Received Box 5 Battery Status response:', response);
        if (response === '0') {
          this.bsData5 = true;
        } else {
          this.bsData5 = false;
        }
      });
  }

  // // Subscribe to Box 5 Solenoid sensor
  // subscribeToBox5Sd() {
  //   this.webSocketService
  //     .subscribeToSolenoidTopic('05')
  //     .subscribe((response) => {
  //       console.log('Received Box 5 Solenoid response:', response);
  //     });
  // }

  // Subscribe to Box 6 IR sensor
  // subscribeToBox6Ir() {
  //   this.webSocketService.subscribeToIrTopic('06').subscribe((response) => {
  //     console.log('Received Box 6 IR response:', response);
  //   });
  // }

  // Subscribe to Box 6 Temperature sensor
  subscribeToBox6Tm() {
    this.webSocketService
      .subscribeToTemperatureTopic('06')
      .subscribe((response) => {
        // console.log('Received Box 6 Temperature response:', response);
      });
  }

  // Subscribe to Box 6 Battery Status sensor
  subscribeToBox6Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('06')
      .subscribe((response) => {
        // console.log('Received Box 6 Battery Status response:', response);
        if (response === '0') {
          this.bsData6 = true;
        } else {
          this.bsData6 = false;
        }
      });
  }

  // Subscribe to Box 6 Solenoid sensor
  // subscribeToBox6Sd() {
  //   this.webSocketService
  //     .subscribeToSolenoidTopic('06')
  //     .subscribe((response) => {
  //       console.log('Received Box 6 Solenoid response:', response);
  //     });
  // }

  openPopup(): void {
    this.showPopup = true;
    console.log('popup button trigger'); // Show the popup
  }

  closePopup(): void {
    this.showPopup = false; // Hide the popup
  }
}
