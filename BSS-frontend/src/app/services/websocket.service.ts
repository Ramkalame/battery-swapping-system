import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: any;
  private messageSubjects: { [topic: string]: Subject<any> } = {}; // Map of topics to subjects
  private connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  ); // Connection status
  private messageQueue: { destination: string; payload: any }[] = []; // Queue for unsent messages


  constructor() {
    this.connect(); // Connect to the WebSocket server
  }

  /**
   * Establishes the WebSocket connection.
   */
  private connect(): void {
    const socket = new SockJS('http://localhost:8080/ws'); // WebSocket endpoint
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {},
      () => {
        console.log('Connected to WebSocket server.');
        this.connectionStatus.next(true); // Mark connection as established
        this.flushMessageQueue();
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
        this.connectionStatus.next(false); // Mark connection as not established
      }
    );
  }

  /**
   * Subscribes to a specific topic on the WebSocket server.
   * @param topic - The topic to subscribe to.
   * @param parser - A function to parse the incoming message (optional).
   * @returns An Observable that emits parsed messages of the expected type.
   */
  subscribeToTopic<T>(
    topic: string,
    parser?: (message: string) => T
  ): Observable<T> {
    if (!this.messageSubjects[topic]) {
      this.messageSubjects[topic] = new Subject<T>();

      this.connectionStatus.subscribe((connected) => {
        if (connected && this.stompClient) {
          console.log(`Subscribing to topic: ${topic}`);
          this.stompClient.subscribe(topic, (message: any) => {
            if (message.body) {
              try {
                const parsedMessage = parser
                  ? parser(message.body)
                  : (message.body as unknown as T);
                this.messageSubjects[topic].next(parsedMessage); // Pass the parsed message to the subject
              } catch (error) {
                console.error(
                  `Error parsing message for topic "${topic}":`,
                  error
                );
              }
            }
          });
        }
      });
    }

    // Return the Observable for the topic
    return this.messageSubjects[topic].asObservable();
  }

  sendMessage(destination: string, payload: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(payload));
      console.log(`Message sent to ${destination}:`, payload);
    } else {
      console.warn('WebSocket not connected. Queueing message.');
      this.messageQueue.push({ destination, payload }); // Queue the message
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const { destination, payload } = this.messageQueue.shift()!;
      this.sendMessage(destination, payload);
    }
  }
}
