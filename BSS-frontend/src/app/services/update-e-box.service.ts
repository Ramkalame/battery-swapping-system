import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateEBoxService {

  private emptyBoxNumberSubject = new BehaviorSubject<number | null>(null);

  constructor() { }

  // Observable for other components to subscribe to
  emptyBoxNumber$ = this.emptyBoxNumberSubject.asObservable();

  // Method to update the empty box number
  updateEmptyBoxNumberToComponents(boxNumber: number): void {
    this.emptyBoxNumberSubject.next(boxNumber);
  }

}
