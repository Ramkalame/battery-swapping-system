import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../models/User';
import { ApiService } from '../services/api.service';
import { WebsocketService } from '../services/websocket.service';
import { TestAnimationComponent } from "../test-animation/test-animation.component";

@Component({
  selector: 'app-battery-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, TestAnimationComponent],
  templateUrl: './battery-dashboard.component.html',
  styleUrl: './battery-dashboard.component.css',
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
export class BatteryDashboardComponent implements OnInit {

 isBatteryInserted: boolean = false;
  isBatteryCharged: boolean = false;

  rfId!: string;

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
   
    // Subscribe to the /rf Topic
    this.webSocketService
      .subscribeToTopic<string>('/topic/rf')
      .subscribe((message: string) => {
        console.log('Received message RF:', message);
        this.rfId = message;
        // After receiving the RFID, redirect to the Dashboard
        this.router.navigate(['/wait', this.rfId]);
      });

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

    //subscribing for tm Data
    this.subscribeToBox1Tm();
    this.subscribeToBox2Tm();
    this.subscribeToBox3Tm();
    this.subscribeToBox4Tm();
    this.subscribeToBox5Tm();
    this.subscribeToBox6Tm();

    //subscribing for tm Data
    this.subscribeToBox1Sd();
    this.subscribeToBox2Sd();
    this.subscribeToBox3Sd();
    this.subscribeToBox4Sd();
    this.subscribeToBox5Sd();
    this.subscribeToBox6Sd();

    setTimeout(() => {
      this.router.navigate(['/card-swaipe-message']);
    }, 4500);
  }

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
        console.log('Received Box 1 Temperature response:', response);
      });
  }

  // Subscribe to Box 1 Battery Status sensor
  subscribeToBox1Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('01')
      .subscribe((response) => {
        if (response === '0') {
          this.bsData1 = true;
        } else {
          this.bsData1 = false;
        }
        console.log('Received Box 1 Battery Status response:', response);
      });
  }

  // Subscribe to Box 1 Solenoid sensor
  subscribeToBox1Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('01')
      .subscribe((response) => {
        console.log('Received Box 1 Solenoid response:', response);
      });
  }

  // Subscribe to Box 2 IR Sensor
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
        console.log('Received Box 2 Temperature response:', response);
      });
  }

  //Subscribe to Box2 Battery Status Sensor
  subscribeToBox2Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('02')
      .subscribe((response) => {
        if (response === '0') {
          this.bsData2 = true;
        } else {
          this.bsData2 = false;
        }
        console.log('Received Box 2 Battery Status response:', response);
      });
  }

  // Subscribe to Box 2 Solenoid sensor
  subscribeToBox2Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('02')
      .subscribe((response) => {
        console.log('Received Box 2 Solenoid response:', response);
      });
  }

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
        console.log('Received Box 3 Temperature response:', response);
      });
  }

  //Subscribe to Box3 Battery Status Sensor
  subscribeToBox3Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('03')
      .subscribe((response) => {
        if (response === '0') {
          this.bsData3 = true;
        } else {
          this.bsData3 = false;
        }
        console.log('Received Box 3 Battery Status response:', response);
      });
  }

  //Subscribe to Box3 Solenoid Sensor
  subscribeToBox3Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('03')
      .subscribe((response) => {
        console.log('Received Box 3 Solenoid response:', response);
      });
  }

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
        console.log('Received Box 4 Temperature response:', response);
      });
  }

  // Subscribe to Box 4 Battery Status sensor
  subscribeToBox4Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('04')
      .subscribe((response) => {
        if (response === '0') {
          this.bsData4 = true;
        } else {
          this.bsData4 = false;
        }
        console.log('Received Box 4 Battery Status response:', response);
      });
  }

  // Subscribe to Box 4 Solenoid sensor
  subscribeToBox4Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('04')
      .subscribe((response) => {
        console.log('Received Box 4 Solenoid response:', response);
      });
  }

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
        console.log('Received Box 5 Temperature response:', response);
      });
  }

  // Subscribe to Box 5 Battery Status sensor
  subscribeToBox5Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('05')
      .subscribe((response) => {
        if (response === '0') {
          this.bsData5 = true;
        } else {
          this.bsData5 = false;
        }
        console.log('Received Box 5 Battery Status response:', response);
      });
  }

  // Subscribe to Box 5 Solenoid sensor
  subscribeToBox5Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('05')
      .subscribe((response) => {
        console.log('Received Box 5 Solenoid response:', response);
      });
  }

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
        console.log('Received Box 6 Temperature response:', response);
      });
  }

  // Subscribe to Box 6 Battery Status sensor
  subscribeToBox6Bs() {
    this.webSocketService
      .subscribeToBatteryStatusTopic('06')
      .subscribe((response) => {
        if (response === '0') {
          this.bsData6 = true;
        } else {
          this.bsData6 = false;
        }
        console.log('Received Box 6 Battery Status response:', response);
      });
  }

  // Subscribe to Box 6 Solenoid sensor
  subscribeToBox6Sd() {
    this.webSocketService
      .subscribeToSolenoidTopic('06')
      .subscribe((response) => {
        console.log('Received Box 6 Solenoid response:', response);
      });
  }


}
