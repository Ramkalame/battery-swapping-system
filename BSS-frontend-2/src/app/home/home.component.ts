import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private rfSubscription!: Subscription;
  private timeoutId!: any;
  rfId!: string;
  loaded = false;

  constructor(
    private router: Router,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
     setTimeout(() => {
      this.loaded = true;
    }, 100);
    // Subscribe to the /rf Topic
    this.rfSubscription = this.webSocketService
      .subscribeToTopic<string>('/topic/rf')
      .subscribe((message: string) => {
        console.log('Received message RF:', message);
        this.rfId = message;
        // After receiving the RFID, redirect to the wait page
        this.router.navigate(['/wait', this.rfId]);
      });

    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/card-swaipe-message']);
    }, 8000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.rfSubscription?.unsubscribe();
  }
}
