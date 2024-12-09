import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit {

  messages: string[] = []; 

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit(): void {
     // Subscribe to the WebSocket messages
     this.webSocketService.getMessages().subscribe((message: string) => {
      console.log('Received message:', message);
      this.messages.push(message); // Add the message to the list
    });
  }


}
