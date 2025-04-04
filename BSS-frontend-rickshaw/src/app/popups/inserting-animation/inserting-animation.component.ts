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
import { ApiResponse, BatteryStatus, Status } from '../../models/User';
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
    //  this.assignOpenDoorIndicesDuringInserting();
    this.selectBoxForInsertion();

      // Check for empty batteries and send the command
      // this.openEmptyBoxDoor();
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
  console.log( "this is  battery status for Empty box: ", emptyBox);
  this.openDoorDuringInserting = emptyBox ? emptyBox.boxNumber.toString() : null;
  console.log("Empty Box Now: ", this.openDoorDuringInserting)
  this.commandToOpenTheDoor(`OPEN${this.openDoorDuringInserting}`);
  this.OpneBufferingDelay = setTimeout(()=>{this.isWaitingAnimationShow=true},5500);
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

        // Fetch updated battery status
        this.fetchbatteryStatusInterval = setTimeout(()=>{
          console.log("Fetching updated battery status after 15 seconds...");
          this.fetchUpdatedBatteryStatus();
          
        }, 5000);
        
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
  const fullBox = this.batteryStatusForTaking.find((box) => box.batteryStatus === Status.FULL_CHARGED);
  console.log( "this is  battery status for full charged: ", fullBox);
  this.openDoorDuringTaking = fullBox ? fullBox.boxNumber.toString() : null;
  console.log("Fuly CHarged Box Now: ", this.openDoorDuringTaking)
  this.isWaitingAnimationShow=false;
  this.isTakingBatteryAnimationShow=true;
  this.commandToOpenTheDoor(`OPEN${this.openDoorDuringTaking}`);
  this.navigateGreatePageInterval = setTimeout(()=>{
    // this.apiService.addBatteryTransactions(this.rfId).subscribe({
    //   next:(response:any)=>{
    //     console.log(response.message);
    //   },
    //   error:(error:any)=>{
    //     console.log(error.error.message);
    //   }
    // })
    this.router.navigate(['/greet'])
  }, 5000)
  
}

// Method to get the latest battery status
fetchUpdatedBatteryStatus() {
  this.apiService.getAllBatteryStatus().subscribe({
    next: (status: ApiResponse<BatteryStatus[]>) => {
      this.batteryStatusForTaking = status.data;
      console.log("Updated battery status fetched:", this.batteryStatusForTaking);
      // Store updated battery status in localStorage
      localStorage.setItem("batteryState2", JSON.stringify(this.batteryStatusForTaking));
      this.isInsertingBatteryAnimationShow=false;
      this.isWaitingAnimationShow=true;
      this.callAssignOpenDoorIndicesDuringTakingInterval = setTimeout(()=>{
        // Reassign open door indices
      // this.assignOpenDoorIndicesDuringTaking();
      this.selectBoxForTaking();
      }, 5000);
    },
    error: (error: any) => {
      console.error("Error fetching updated battery status:", error);
    },
  });
}


}
