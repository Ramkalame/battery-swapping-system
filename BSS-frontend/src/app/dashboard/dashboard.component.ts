import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../models/User';
import { ApiService } from '../services/api.service';
import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('batterySwapAnimation', [
      state('closed', style({
        transform: 'scale(1)',  
        opacity: 1
      })),
      state('open', style({
        transform: 'scale(0.8)',  
      })),
      transition('closed <=> open', [
        animate('1s ease-in-out')  
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit{
  isBatteryInserted: boolean = false; 
  isBatteryCharged: boolean = false;
  selectedUser!: User;

  rfId!: string;
  irData!: boolean;
  solenoidData:boolean = true;



  constructor(
    private webSocketService: WebsocketService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(): void {
      // Retrieve the rfId parameter from the route
    this.route.params.subscribe(params => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });
    this.getUserDetails(this.rfId);
   

    //subscribe to the IR sensor topic
    this.webSocketService
    .subscribeToTopic<string>('/topic/ir-sensor')
    .subscribe((message: string) => {
      console.log('Received message IR:', message);
      console.log('Type of message:', typeof message);
      if(message === 'true'){
        this.irData = true;
      }else{
        this.irData = false;
      }
    });

    //listen to solenoid response
    this.listenForSolenoidResponse();

      // Redirect to home after 20 seconds
  setTimeout(() => {
    this.router.navigate(['/greet']);
  }, 25000);  // 20 seconds delay (20000 milliseconds)
  }

  getUserDetails(rfId: string) {
    this.apiService.getUserById(rfId).subscribe({
      next: (data: User) => {
        this.selectedUser = data;
      },
      error: (error: any) => {
        console.log('Something Went Wrong');
      },
    });
  }


   // Listen to /topic/solenoid-response
   listenForSolenoidResponse() {
    this.webSocketService
      .subscribeToTopic<string>('/topic/solenoid-response')
      .subscribe((response) => {
        console.log('Received solenoid response:', response);
        if(response === '0'){
          this.solenoidData = false;
        }else{
          this.solenoidData = true;
        }
      });
  }


  toggleSwapState() {
    this.solenoidData = !this.solenoidData; 
  }



}
