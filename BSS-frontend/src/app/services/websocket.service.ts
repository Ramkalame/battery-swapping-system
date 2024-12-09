import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  private stompClient: any;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.connect(); // Connect to the WebSocket server when the service is initialized
  }

  private connect(): void {
    // WebSocket URL for the SockJS endpoint
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    // Connect to the WebSocket server
    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket server.');

      // Subscribe to the /topic/updates channel
      this.stompClient.subscribe('/topic/updates', (message: any) => {
        if (message.body) {
          this.messageSubject.next(message.body); // Pass the message to the subject
        }
      });
    });
  }

  // Observable to expose WebSocket messages to other parts of the app
  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
