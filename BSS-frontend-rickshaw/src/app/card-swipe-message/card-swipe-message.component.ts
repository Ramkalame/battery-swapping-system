import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-swipe-message',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './card-swipe-message.component.html',
  styleUrl: './card-swipe-message.component.css',
})
export class CardSwipeMessageComponent implements OnInit {
  private rfSubscription!: Subscription;
  private timeoutId!: any;
  rfId!: string;

  constructor(
    private router: Router,
    private webSocketService: WebsocketService
  ) {}
  ngOnInit(): void {
    // Subscribe to the /rf Topic
    this.rfSubscription = this.webSocketService
      .subscribeToTopic<string>('/topic/rf')
      .subscribe((message: string) => {
        console.log('Received message RF:', message);
        this.rfId = message;
        // After receiving the RFID, redirect to the Dashboard
        this.router.navigate(['/wait', this.rfId]);
      });

    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/']);
    }, 9000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.rfSubscription?.unsubscribe();
  }
}
