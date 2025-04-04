import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ApiResponse, Status, BatteryStatus } from '../../models/User';
import { BatteryTransaction, EmptyBox } from '../../models/BatteryTransaction';
import { WebsocketService } from '../../services/websocket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  //to show the animation while inserting and taking 
  isTakingBatteryAnimationShow: boolean = false;
  isInsertingBatteryAnimationShow: boolean = true;
  // Start with step-1 for animation sequence
  activeStep = 1; 
  //to show or hide the waiting buffer animation
  isWaitingAnimationShow: boolean = false;
  always = true;

  //needs to unsubscribe or destroy
  private intervalId: any;
  private intervalId2: any;
  private fetchbatteryStatusInterval:any;
  private navigateGreatePageInterval:any;
  private callAssignOpenDoorIndicesDuringTakingInterval:any;
  private OpneBufferingDelay:any;
  private openDoorSubscription!: Subscription;
  private transactionSubscription!:Subscription;


  //charged battery status
  batteryStatusForInserting: BatteryStatus[] = [];
  batteryStatusForTaking: BatteryStatus[] = [];
  openDoorDuringInserting: string | null = null;
  openDoorDuringTaking: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    const stoaredBatteryStatus = localStorage.getItem("batteryState");
    if(stoaredBatteryStatus){
      this.batteryStatusForInserting = JSON.parse(stoaredBatteryStatus);
      console.log("loaded battery status from the user profile component  to inserting animation component: ", this.batteryStatusForInserting);
      
      // Call the method AFTER batteryStatus is populated
    this.selectBoxForInsertion();

      // Check for empty batteries and send the command
    }else{
      console.log('No Battery Status found in localStorage.');
    }
    //call all the method on page loading
    this.startAnimationSequence();
  }

  // Emit an event to close the popup
  closePopup(): void {
    this.close.emit(); 

  }
  ngOnDestroy(): void {
    // Clear interval to avoid memory leaks
    clearTimeout(this.intervalId);
    clearTimeout(this.intervalId2);
    clearTimeout(this.fetchbatteryStatusInterval);
    clearTimeout(this.navigateGreatePageInterval);
    clearTimeout(this.callAssignOpenDoorIndicesDuringTakingInterval);
    clearTimeout(this.OpneBufferingDelay);
    //Unsubscribe all the subscriptions
    this.openDoorSubscription?.unsubscribe();
  }

  

  //to start the animatin sequence
  startAnimationSequence(): void {
    this.intervalId = setInterval(() => {
      this.activeStep = this.activeStep < 3 ? this.activeStep + 1 : 1; // Loop through steps
    }, 10000); // Change step every 15 seconds
  }

 /**
   * Select the first empty box for inserting a battery.
   */
 selectBoxForInsertion() {
  const emptyBox = this.batteryStatusForInserting.find((box) => box.batteryStatus === Status.EMPTY);
  console.log("Battery status for Empty box: ", emptyBox);
  this.openDoorDuringInserting = emptyBox ? emptyBox.boxNumber.toString() : null;
  console.log("Empty Box Now: ", this.openDoorDuringInserting);

  // Start inserting animation (30s total)
  this.isInsertingBatteryAnimationShow = true;
  this.commandToOpenTheDoor(`OPEN${this.openDoorDuringInserting}`);

  // After 30 seconds of inserting, show buffering
  this.OpneBufferingDelay = setTimeout(() => {
    this.isInsertingBatteryAnimationShow = false;
    this.isWaitingAnimationShow = true;

    // Buffering delay: 3 seconds
    setTimeout(() => {
      this.isWaitingAnimationShow = false;
      this.selectBoxForTaking();  // Handles showing taking animation
    }, 3000);
  }, 30000);
}





  //this is to give command to the arduino to open the door of empty box
commandToOpenTheDoor(command: string) {
  this.openDoorSubscription = this.apiService
    .sendCommandToArduino(command)
    .subscribe({
      next: (response: ApiResponse<string>) => {
        console.log('-------OPEN Door Called------', command);

        // Clear local storage
        localStorage.removeItem("batteryState");
        console.log("Battery status cleared from localStorage.");
        
      },
      error: (error: any) => {
        console.log(error.error.message);
      },
    });
}

/**
   * Select the first fully charged battery for removal.
   */
selectBoxForTaking() {
  const fullBox = this.batteryStatusForInserting.find((box) => box.batteryStatus === Status.FULL_CHARGED);
  console.log("Battery status for full charged: ", fullBox);
  this.openDoorDuringTaking = fullBox ? fullBox.boxNumber.toString() : null;
  console.log("Fully Charged Box Now: ", this.openDoorDuringTaking);

  // Show taking animation (30 seconds)
  this.isTakingBatteryAnimationShow = true;
  this.commandToOpenTheDoor(`OPEN${this.openDoorDuringTaking}`);
  this.addBatteryTransaction();
  this.navigateGreatePageInterval = setTimeout(() => {
    // Navigate to greet page
    this.router.navigate(['/greet']);
  }, 30000);
}


addBatteryTransaction(){
  const rfIdFromSessionStorage = sessionStorage.getItem("rfId");
  this.rfId = rfIdFromSessionStorage ? rfIdFromSessionStorage : this.rfId; // Use the passed rfId or the one from session storage
  if(rfIdFromSessionStorage){
    
  this.apiService.addBatteryTransactions(rfIdFromSessionStorage).subscribe({
    next: (response: ApiResponse<BatteryTransaction>) => {
      console.log('Battery transaction added successfully:', response.data);
    },
    error: (error: any) => {
      console.error('Error adding battery transaction:', error);
    },
  });}else{
    console.error('No RFID found in session storage.');
  }
}

  
  
}
