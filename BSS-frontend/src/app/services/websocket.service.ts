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
  );


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

  subscribeToIrTopic(boxNumber:string):Observable<any> {
    const topic = `/topic/box/${boxNumber}/ir`;
    return this.subscribeToTopic<string>(topic);
  }

  subscribeToTemperatureTopic(boxNumber:string):Observable<any> {
    const topic = `/topic/box/${boxNumber}/tm`;
    return this.subscribeToTopic<string>(topic);
  }

  subscribeToBatteryStatusTopic(boxNumber:string):Observable<any> {
    const topic = `/topic/box/${boxNumber}/bs`;
    return this.subscribeToTopic<string>(topic);
  }

  subscribeToSolenoidTopic(boxNumber:string):Observable<any> {
    const topic = `/topic/box/${boxNumber}/sd`;
    return this.subscribeToTopic<string>(topic);
  }


}
