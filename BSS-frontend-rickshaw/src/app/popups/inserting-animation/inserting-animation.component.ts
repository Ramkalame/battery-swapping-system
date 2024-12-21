import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ApiResponse, BatteryStatus } from '../../models/User';
import { BatteryTransaction, EmptyBox } from '../../models/BatteryTransaction';
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

  //assign the rfId while calling this component
  @Input() rfId!: string;
  @Output() close = new EventEmitter<void>();
  //to store the empty current active box for inserting battery
  openDoorDuringInserting!: number; 
  //to store the box number for taking the charged battery
  openDoorDuringTaking!: number;
  //to show the animation while inserting and taking 
  isTakingBatteryAnimationShow: boolean = false;
  isInsertingBatteryAnimationShow: boolean = true;
  // Start with step-1 for animation sequence
  activeStep = 1; 
  //to show or hide the waiting buffer animation
  isWaitingAnimationShow: boolean = false;

  //needs to unsubscribe or destroy
  private intervalId: any;
  private intervalId2: any;
  private getEmptyBoxSubscription!: Subscription;
  private openDoorSubscription!: Subscription;
  private updateEmptyBoxSubscription!: Subscription;
  private batteryTransactionSubscription!: Subscription;
  private batteryStatusSubscription!: Subscription;

  //charged battery status
  bsArray!: BatteryStatus[];

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    //call all the method on page loading
    this.startAnimationSequence();
    this.getCurrentEmptyBox();
    this.getAllBatteryStatus();
  }

  // Emit an event to close the popup
  closePopup(): void {
    this.close.emit(); 

  }
  ngOnDestroy(): void {
    // Clear interval to avoid memory leaks
    clearTimeout(this.intervalId);
    clearTimeout(this.intervalId2);
    //Unsubscribe all the subscriptions
    this.getEmptyBoxSubscription?.unsubscribe();
    this.openDoorSubscription?.unsubscribe();
    this.updateEmptyBoxSubscription?.unsubscribe();
    this.batteryTransactionSubscription?.unsubscribe();
    this.batteryStatusSubscription?.unsubscribe();
  }

  //to fetch all the battery status from the database.
  getAllBatteryStatus() {
    this.batteryStatusSubscription = this.apiService
      .getAllBatteryStatus()
      .subscribe({
        next: (response: ApiResponse<BatteryStatus[]>) => {
          //assign the fetched data to the battery status array
          this.bsArray = response.data;
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }

  //to start the animatin sequence
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
          console.log('-------Empty Box Called------');
          console.log(response.message + ' :-' + response.data.boxNumber);
          //assign the empty box number to the variable
          this.openDoorDuringInserting = response.data.boxNumber;
          //now send command to the arduino to open the door of empty box
          this.commandToOpenTheDoor('OPEN' + this.openDoorDuringInserting);
          //to verify the battery status after process 1
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
          console.log('-------OPEN Door Called------',command);
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }

  //To verify the battery status after inserting battery
  toVerfiyBatteryStatusOfEmptyBoxP1() {
    console.log('-------VrifyP1 Called------');
    //it will execute after 45 second time interval
    this.intervalId2 = setTimeout(() => {
      //after inserting the battery called the method to check the first full charged battery
      this.checkAndOpenFullyChargedBatteryBox();
      //update the empty box in database 
      this.updateTheNewEmptyBox(this.openDoorDuringTaking);
      //}
    }, 45000);
  }

  //To verify the battery status after taking and taking battery
  toVerfiyBatteryStatusOfEmptyBoxP2() {
    console.log('-------VrifyP2 Called------');
    this.intervalId2 = setTimeout(() => {
      //add a record of new transaction in the database
      this.batteryTransactionSubscription = this.apiService
        .addBatteryTransactions(this.rfId)
        .subscribe({
          next: (response: ApiResponse<BatteryTransaction>) => {
            console.log('-------Battery Transaction Called------');
            console.log(response.message + ' :-' + response.data);
            const data: BatteryStatus = {
              id: `b${this.openDoorDuringTaking}`,
              status: 0,
            };
            //update the taken box status as 0
            this.apiService.updateBatteryStatus(data).subscribe({
              next: (response: ApiResponse<BatteryStatus>) => {
                console.log('Battery Status Updated: ' + response.data);
              },
              error: (error: any) => {
                console.log('Something Went Wrong');
              },
            });
            //then navigate to the greet page
            this.router.navigate(['/greet']);
          },
          error: (error: any) => {
            console.log('Something Went Wrong');
          },
        });
      // }
    }, 30000);
  }

  // This to open the first fully charnged battery box door only
  checkAndOpenFullyChargedBatteryBox() {
    console.log('------- Fully Charged Check Called ------');
    //sort the array from b1 to b10
    const sortedBsArray = this.bsArray.sort((a, b) =>
      a.id === 'b10' ? 1 : b.id === 'b10' ? -1 : 0
    );
    //loop through the array and find the first charged battery
    for (let batteryStatus of sortedBsArray) {
      //check if the battery status is 1
      if (batteryStatus.status === 1) {
        //assign the charged battery box number to blink
        this.openDoorDuringTaking = Number(batteryStatus.id.substring(1));
        //set the empty box number to 0
        this.openDoorDuringInserting = 0;
        //show the buffering for  3 second 
        this.showBufferingBeforP2();
        //hide the inserting battery animation
        //command to opent the charged battery box door
        this.isInsertingBatteryAnimationShow = false;
        this.commandToOpenTheDoor(`OPEN${this.openDoorDuringTaking}`);
        break;
      }
    }
  }

  //show the buffering animation
  showBufferingBeforP2() {
    //set the animation variable to true
    this.isWaitingAnimationShow = true;
    setTimeout(() => {
      //then after 3 second hide the buffering animation
      this.isWaitingAnimationShow = false;
      //then show the battery taking animation
      this.isTakingBatteryAnimationShow = true;
    }, 3000);
  }

  //update the new empty box in the db
  updateTheNewEmptyBox(boxNumber: number) {
    console.log('-------Update Empty Box Called------');
    this.updateEmptyBoxSubscription = this.apiService
      .updateCurrentEmptyBox(boxNumber)
      .subscribe({
        next: (response: ApiResponse<EmptyBox>) => {
          console.log(response.message + ' :-' + response.data.boxNumber);
          //call the verify method for the second process 
          this.toVerfiyBatteryStatusOfEmptyBoxP2();
        },
        error: (error: any) => {
          console.log('Something Went Wrong');
        },
      });
  }
}
