import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/User';
import { EmptyBox } from '../../models/BatteryTransaction';
import { WebsocketService } from '../../services/websocket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inserting-animation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inserting-animation.component.html',
  styleUrl: './inserting-animation.component.css',
})
export class InsertingAnimationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  newOpenBox!: number;
  openDoor!: number; // This will store which box is open
  isTakingBatteryAnimationShow: boolean = false;
  isInsertingBatteryAnimationShow: boolean = true;
  activeStep = 1; // Start with step-1
  isWaitingAnimationShow: boolean = false;

  //needs to unsubscribe or destroy
  private intervalId: any;
  private intervalId2: any;
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
  private getEmptyBoxSubscription!: Subscription;
  private openDoorSubscription!: Subscription;
  private closeDoorSubscription!: Subscription;
  private updateEmptyBoxSubscription!: Subscription;

  //charged battery status
  bsArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //first index ignored

  constructor(
    private apiService: ApiService,
    private webSocketService: WebsocketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startAnimationSequence();
    this.getCurrentEmptyBox();

    //subscribing for tm Data
    this.subscribeToBox1Bs();
    this.subscribeToBox2Bs();
    this.subscribeToBox3Bs();
    this.subscribeToBox4Bs();
    this.subscribeToBox5Bs();
    this.subscribeToBox6Bs();
    this.subscribeToBox7Bs();
    this.subscribeToBox8Bs();
    this.subscribeToBox9Bs();
    this.subscribeToBox10Bs();

    setTimeout(() => {
      console.log(this.bsArray);
    }, 3000);
  }

  closePopup(): void {
    this.close.emit(); // Emit an event to close the popup
  }
  ngOnDestroy(): void {
    // Clear interval to avoid memory leaks
    clearInterval(this.intervalId);
    clearInterval(this.intervalId2);
    //Unsubscribe all the subscriptions
    this.bsSubscription1?.unsubscribe();
    this.bsSubscription2?.unsubscribe();
    this.bsSubscription3?.unsubscribe();
    this.bsSubscription4?.unsubscribe();
    this.bsSubscription5?.unsubscribe();
    this.bsSubscription6?.unsubscribe();
    this.bsSubscription7?.unsubscribe();
    this.bsSubscription8?.unsubscribe();
    this.bsSubscription9?.unsubscribe();
    this.bsSubscription10?.unsubscribe();
    this.getEmptyBoxSubscription?.unsubscribe();
    this.openDoorSubscription?.unsubscribe();
    this.closeDoorSubscription?.unsubscribe();
    this.updateEmptyBoxSubscription?.unsubscribe();
  }

  startAnimationSequence(): void {
    this.intervalId = setInterval(() => {
      this.activeStep = this.activeStep < 3 ? this.activeStep + 1 : 1; // Loop through steps
    }, 10000); // Change step every 15 seconds
  }

  //To fetch the empty box details from db which is updated on last transaction
  getCurrentEmptyBox() {
    this.getEmptyBoxSubscription = this.apiService
      .getCurrentEmptyBox()
      .subscribe({
        next: (response: ApiResponse<EmptyBox>) => {
          console.log('-------L Empty Box Called------');
          console.log(response.message + ' :-' + response.data.boxNumber);
          //this method will fetch the latest empty box number from the database
          this.openDoor = response.data.boxNumber;
          //this command is used to open the empty box to insert dischared battey
          this.commandToOpenTheDoor('OPEN' + this.openDoor);
          //after the command it will call the method to verify the battery status whether the battery is charging or not
          //this methd will execute after 40 seconds of delay to ensure the batterys status is correct
          this.toVerfiyBatteryStatusOfEmptyBoxP1();
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }

  //this is to give command to the arduino to open the door of empty box
  commandToOpenTheDoor(command: string) {
    this.openDoorSubscription = this.apiService
      .sendCommandToArduino(command)
      .subscribe({
        next: (response: ApiResponse<string>) => {
          console.log('-------L OPEN Door Called------');
          console.log('Command sent to Arduion OPEN DOOR: ' + response.data);
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }

  //this is to give command to the arduino to close the door
  commandToCloseTheDoor(command: string) {
    this.closeDoorSubscription = this.apiService
      .sendCommandToArduino(command)
      .subscribe({
        next: (response: ApiResponse<string>) => {
          console.log('-------L Close Door Called------');
          console.log('Command sent to Arduion CLOSE DOOR: ' + response.data);
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }

  //To verify the battery status after taking and inserting battery
  toVerfiyBatteryStatusOfEmptyBoxP1() {
    console.log('-------L VrifyP1 Called------');
    //it will set interval for 40 seconds after calling this method
    this.intervalId2 = setInterval(() => {
      //this condition will check wether the battery status of the empty box is 0(charging) or 1(error detetected)
      if (this.bsArray[this.openDoor] === 0) {
        console.log('-------L VrifyP1 INSIDE CONDITION------');
        //this will execute if the battery status of the empty box is 0 (charging)
        //this command is to close the door after successful verification
        // this.commandToCloseTheDoor(`CLOSE${this.openDoor}`);
        //then it will find the first charged battery
        this.checkAndOpenFullyChargedBatteryBox();
        //update the new empty box number in database
        this.updateTheNewEmptyBox(this.openDoor);
        // this.isWaitingAnimationShow = true;
      }
    }, 35000);
  }

  //To verify the battery status after taking and taking battery
  toVerfiyBatteryStatusOfEmptyBoxP2() {
    console.log('-------L VrifyP2 Called------');
    //it will set interval for 40 seconds after calling this method
    this.intervalId2 = setInterval(() => {
      //this condition will check wether the battery status of the empty box is 0(charging) or 1(error detetected)
      if (this.bsArray[this.openDoor] === 1) {
        //this will execute if the battery status of the empty box is 1 (means error becauser battery is taken )
        // this.commandToCloseTheDoor(`B0${this.openDoor}SD0`);
        //afte completion navigate to the greet page
        this.router.navigate(['/greet']);
      }
    }, 35000);
  }

  // This to open the first fully charnged battery box door only
  checkAndOpenFullyChargedBatteryBox() {
    console.log('-------L Fully Charged Check Called------');
    // Use a for loop to iterate from 1 to 6 for the box numbers
    for (let i = 1; i <= 10; i++) {
      const batteryStatus = this.bsArray[i]; // Access the box status
      if (batteryStatus === 1) {
        // This will execute if the battery status is 1 (fully charged)
        this.openDoor = i; // Assign the box number (starting from 1) to openDoor variable
        console.log(`Box ${i} is fully charged.`);
        // Command to open the fully charged battery box
        this.showBufferingBeforP2();
        this.isInsertingBatteryAnimationShow = false;
        this.commandToOpenTheDoor(`OPEN${i}`);
        break; // Exit the loop after opening the first fully charged box
      }
    }
  }

  showBufferingBeforP2() {
    this.isWaitingAnimationShow = true;
    setTimeout(() => {
      this.isWaitingAnimationShow =false;
      this.isTakingBatteryAnimationShow = true;
    }, 3000);
  }

  updateTheNewEmptyBox(boxNumber: number) {
    console.log('-------L Update Empty Box Called Called------');
    this.updateEmptyBoxSubscription = this.apiService
      .updateCurrentEmptyBox(boxNumber)
      .subscribe({
        next: (response: ApiResponse<EmptyBox>) => {
          console.log(response.message + ' :-' + response.data.boxNumber);
          this.toVerfiyBatteryStatusOfEmptyBoxP2();
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }

  // Subscribe to Box 1 Battery Status sensor
  subscribeToBox1Bs() {
    this.bsSubscription1 = this.webSocketService
      .subscribeToBatteryStatusTopic('01')
      .subscribe((response) => {
        // console.log('Received Box 1 Battery Status response:', response);
        this.bsArray[1] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  //Subscribe to Box2 Battery Status Sensor
  subscribeToBox2Bs() {
    this.bsSubscription2 = this.webSocketService
      .subscribeToBatteryStatusTopic('02')
      .subscribe((response) => {
        // console.log('Received Box 2 Battery Status response:', response);
        this.bsArray[2] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  //Subscribe to Box3 Battery Status Sensor
  subscribeToBox3Bs() {
    this.bsSubscription3 = this.webSocketService
      .subscribeToBatteryStatusTopic('03')
      .subscribe((response) => {
        // console.log('Received Box 3 Battery Status response:', response);
        this.bsArray[3] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  // Subscribe to Box 4 Battery Status sensor
  subscribeToBox4Bs() {
    this.bsSubscription4 = this.webSocketService
      .subscribeToBatteryStatusTopic('04')
      .subscribe((response) => {
        // console.log('Received Box 4 Battery Status response:', response);
        this.bsArray[4] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  // Subscribe to Box 5 Battery Status sensor
  subscribeToBox5Bs() {
    this.bsSubscription5 = this.webSocketService
      .subscribeToBatteryStatusTopic('05')
      .subscribe((response) => {
        // console.log('Received Box 5 Battery Status response:', response);
        this.bsArray[5] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  // Subscribe to Box 6 Battery Status sensor
  subscribeToBox6Bs() {
    this.bsSubscription6 = this.webSocketService
      .subscribeToBatteryStatusTopic('06')
      .subscribe((response) => {
        // console.log('Received Box 6 Battery Status response:', response);
        this.bsArray[6] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }
  // Subscribe to Box 7 Battery Status sensor
  subscribeToBox7Bs() {
    this.bsSubscription7 = this.webSocketService
      .subscribeToBatteryStatusTopic('07')
      .subscribe((response) => {
        // console.log('Received Box 7 Battery Status response:', response);
        this.bsArray[7] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  // Subscribe to Box 8 Battery Status sensor
  subscribeToBox8Bs() {
    this.bsSubscription8 = this.webSocketService
      .subscribeToBatteryStatusTopic('08')
      .subscribe((response) => {
        // console.log('Received Box 8 Battery Status response:', response);
        this.bsArray[8] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  // Subscribe to Box 9 Battery Status sensor
  subscribeToBox9Bs() {
    this.bsSubscription9 = this.webSocketService
      .subscribeToBatteryStatusTopic('09')
      .subscribe((response) => {
        // console.log('Received Box 9 Battery Status response:', response);
        this.bsArray[9] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }

  // Subscribe to Box 9 Battery Status sensor
  subscribeToBox10Bs() {
    this.bsSubscription10 = this.webSocketService
      .subscribeToBatteryStatusTopic('10')
      .subscribe((response) => {
        // console.log('Received Box 10 Battery Status response:', response);
        this.bsArray[10] = Number(response);
        this.cdr.detectChanges(); // Notify Angular about the change
      });
  }
}
