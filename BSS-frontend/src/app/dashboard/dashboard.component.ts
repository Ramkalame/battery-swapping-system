import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../models/User';
import { ApiService } from '../services/api.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isBatteryInserted: boolean = false; 
  isBatteryCharged: boolean = false;
  selectedUser!: User;


  rfId!: string;
  irData!: boolean;

  constructor(
    private webSocketService: WebsocketService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

      // Retrieve the rfId parameter from the route
    this.route.params.subscribe(params => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });
    this.getUserDetails(this.rfId);
   

    //subscribe to the IR sensor topic
    this.webSocketService
    .subscribeToTopic<boolean>('/topic/ir-sensor')
    .subscribe((message: boolean) => {
      console.log('Received message IR:', message);
      this.irData = message;
    });



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
}
