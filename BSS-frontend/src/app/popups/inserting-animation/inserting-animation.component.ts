import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenBoxSignalService } from '../../services/open-box-signal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/User';
import { EmptyBox } from '../../models/BatteryTransaction';
import { WebsocketService } from '../../services/websocket.service';
import { UpdateEBoxService } from '../../services/update-e-box.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inserting-animation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inserting-animation.component.html',
  styleUrl: './inserting-animation.component.css',
})
export class InsertingAnimationComponent implements OnInit {
  
  @Output() close = new EventEmitter<void>();
  newOpenBox!:number;
  process1:boolean = true;
  process2: boolean = false;

  openDoor: number = 0; // This will store which box is open
  isTakingBatteryAnimationShow: boolean = false;
  isInsertingBatteryAnimationShow: boolean = false;
  isWaitingAnimationShow: boolean = true;
  activeStep = 1; // Start with step-1
  private intervalId: any;

  constructor(
    private openBoxSignalService: OpenBoxSignalService,
    private apiService: ApiService,
    private webSocketService: WebsocketService,
    private updateEBoxService:UpdateEBoxService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // this.fetchBoxStatus();
    this.startAnimationSequence();
    this.getCurrentEmptyBox();

    //subscribing for tm Data
    this.subscribeToBox1Bs();
    this.subscribeToBox2Bs();
    this.subscribeToBox3Bs();
    this.subscribeToBox4Bs();
    this.subscribeToBox5Bs();
    this.subscribeToBox6Bs();

        //subscribing for tm Data
    this.subscribeToBox1Sd();
    this.subscribeToBox2Sd();
    this.subscribeToBox3Sd();
    this.subscribeToBox4Sd();
    this.subscribeToBox5Sd();
    this.subscribeToBox6Sd();
  }

  fetchBoxStatus() {
    // this.openBoxSignalService.getBoxStatus.subscribe(data=>{
    //   console.log(data);
    // })
    this.openDoor = 3;
  }
  closePopup(): void {
    this.close.emit(); // Emit an event to close the popup
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear interval to avoid memory leaks
  }
  startAnimationSequence(): void {
    this.intervalId = setInterval(() => {
      this.activeStep = this.activeStep < 3 ? this.activeStep + 1 : 1; // Loop through steps
    }, 10000); // Change step every 15 seconds
  }

  getCurrentEmptyBox() {
    this.apiService.getCurrentEmptyBox().subscribe({
      next: (response: ApiResponse<EmptyBox>) => {
        console.log(response.message + ' :-' + response.data.boxNumber);
        this.openDoor = response.data.boxNumber;
      },
      error: (error: any) => {
        console.log('Something Went Wrong');
      },
    });
  }


  // Subscribe to Box 1 Battery Status sensor
  subscribeToBox1Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('01')
      .subscribe((response) => {
        console.log('Received Box 1 Battery Status response:', response);
      });
  }

  // Subscribe to Box 1 Solenoid sensor
  subscribeToBox1Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('01')
      .subscribe((response) => {
        console.log('Received Box 1 Solenoid response:', response);
        this.openDoor=1;
        if(response[0] === '1'){
          this.isTakingBatteryAnimationShow = false;
          this.isInsertingBatteryAnimationShow = true;
          this.process1 = true;
          this.process2 = false;
        }else{
          this.isTakingBatteryAnimationShow = true;
          this.isInsertingBatteryAnimationShow = false;
          this.process2 = true;
          this.process1 = false;
          if(response[1]== '1'){
            this.handleUpdateEmptyBoxNumber(1,1)
            console.log('--- box 1 is now empty')
          }
        }
      });
  }


  //Subscribe to Box2 Battery Status Sensor
  subscribeToBox2Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('02')
      .subscribe((response) => {
        console.log('Received Box 2 Battery Status response:', response);
      });
  }

  // Subscribe to Box 2 Solenoid sensor
  subscribeToBox2Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('02')
      .subscribe((response) => {
        console.log('Received Box 2 Solenoid response:', response);
        this.openDoor=2;
        if(response[0] === '1'){
          this.isTakingBatteryAnimationShow = false;
          this.isInsertingBatteryAnimationShow = true;
          this.process1 = true;
          this.process2 = false;
        }else{
          this.isTakingBatteryAnimationShow = true;
          this.isInsertingBatteryAnimationShow = false;
          this.process2 = true;
          this.process1 = false;
          if(response[1]=='1'){
            this.handleUpdateEmptyBoxNumber(2,1)
            console.log('--- box 2 is now empty')
          }
        }
      });
  }


  //Subscribe to Box3 Battery Status Sensor
  subscribeToBox3Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('03')
      .subscribe((response) => {
        console.log('Received Box 3 Battery Status response:', response);
      });
  }

  //Subscribe to Box3 Solenoid Sensor
  subscribeToBox3Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('03')
      .subscribe((response) => {
        console.log('Received Box 3 Solenoid response:', response);
        this.openDoor=3;
        if(response[0] === '1'){
          this.isTakingBatteryAnimationShow = false;
          this.isInsertingBatteryAnimationShow = true;
          this.process1 = true;
          this.process2 = false;
        }else{
          this.isTakingBatteryAnimationShow = true;
          this.isInsertingBatteryAnimationShow = false;
          this.process2 = true;
          this.process1 = false;
          if(response[1]=='1'){
            this.handleUpdateEmptyBoxNumber(3,1)
            console.log('--- box 3 is now empty')
          }
        }
      });
  }


  // Subscribe to Box 4 Battery Status sensor
  subscribeToBox4Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('04')
      .subscribe((response) => {
        console.log('Received Box 4 Battery Status response:', response);
      });
  }

  // Subscribe to Box 4 Solenoid sensor
  subscribeToBox4Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('04')
      .subscribe((response) => {
        console.log('Received Box 4 Solenoid response:', response);
        this.openDoor=4;
        if(response[0] === '1'){
          this.isTakingBatteryAnimationShow = false;
          this.isInsertingBatteryAnimationShow = true;
          this.process1 = true;
          this.process2 = false;
        }else{
          this.isTakingBatteryAnimationShow = true;
          this.isInsertingBatteryAnimationShow = false;
          this.process2 = true;
          this.process1 = false;
          if(response[1]=='1'){
            this.handleUpdateEmptyBoxNumber(4,1)
            console.log('--- box 4 is now empty')
          }
        }
      });
  }


  // Subscribe to Box 5 Battery Status sensor
  subscribeToBox5Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('05')
      .subscribe((response) => {
        console.log('Received Box 5 Battery Status response:', response);
      });
  }

  // Subscribe to Box 5 Solenoid sensor
  subscribeToBox5Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('05')
      .subscribe((response) => {
        console.log('Received Box 5 Solenoid response:', response);
        this.openDoor=5;
        if(response[0] === '1'){
          this.isTakingBatteryAnimationShow = false;
          this.isInsertingBatteryAnimationShow = true;
          this.process1 = true;
          this.process2 = false;
        }else{
          this.isTakingBatteryAnimationShow = true;
          this.isInsertingBatteryAnimationShow = false;
          this.process2 = true;
          this.process1 = false;
          if(response[1]=='1'){
            this.handleUpdateEmptyBoxNumber(5,1)
            console.log('--- box 5 is now empty')
          }
        }
      });
  }


  // Subscribe to Box 6 Battery Status sensor
  subscribeToBox6Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('06')
      .subscribe((response) => {
        console.log('Received Box 6 Battery Status response:', response);
      });
  }

  // Subscribe to Box 6 Solenoid sensor
  subscribeToBox6Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('06')
      .subscribe((response) => {
        console.log('Received Box 6 Solenoid response:', response);
        this.openDoor=6;
        if(response[0] === '1'){
          this.isTakingBatteryAnimationShow = false;
          this.isInsertingBatteryAnimationShow = true;
          this.process1 = true;
          this.process2 = false;
        }else{
          this.isTakingBatteryAnimationShow = true;
          this.isInsertingBatteryAnimationShow = false;
          this.process2 = true;
          this.process1 = false;
          if(response[1] === '1'){
            this.handleUpdateEmptyBoxNumber(6,1)
            console.log('--- box 6 is now empty')
          }
        }
      });
  }



  //handle the update of new empty box number
  handleUpdateEmptyBoxNumber(boxNumber:number,solenoid:number){
    if(this.process2 && solenoid === 1){
      this.openDoor = boxNumber;
      this.updateEBoxService.updateEmptyBoxNumberToComponents(boxNumber);
      this.apiService.updateCurrentEmptyBox(boxNumber).subscribe({
        next: (response: ApiResponse<EmptyBox>) => {
          console.log(response.message + ' :-' + response.data.boxNumber);
            setTimeout(() => {
            this.router.navigate(['/greet']);
          }, 4000);
        },
        error: (error: any) => {  
          console.log('Something Went Wrong');
        },
      })
    }
  }




}
