import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  rfId!: string;

  constructor(
    private router: Router,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    // Subscribe to the RF-id Topic
    this.webSocketService
      .subscribeToTopic<string>('/topic/rf-id')
      .subscribe((message: string) => {
        console.log('Received message RF:', message);
        this.rfId = message;
        // After receiving the RFID, redirect to the Dashboard
        this.router.navigate(['/dashboard', this.rfId]);
      });
  }
}
