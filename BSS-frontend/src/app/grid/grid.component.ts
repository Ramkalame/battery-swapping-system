import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { CommonModule } from '@angular/common';
import { User } from '../models/User';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent implements OnInit {
  selectedUser!: User;

  rfId!: string;
  irData!: boolean;

  constructor(
    private webSocketService: WebsocketService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    // Subscribe to the RF-id Topic
    this.webSocketService
      .subscribeToTopic<string>('/topic/rf-id')
      .subscribe((message: string) => {
        console.log('Received message RF:', message);
        this.rfId = message;
        this.getUserDetails(message);
      });

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
