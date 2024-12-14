import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenBoxSignalService } from '../../services/open-box-signal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-inserting-animation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inserting-animation.component.html',
  styleUrl: './inserting-animation.component.css'
})
export class InsertingAnimationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  openDoor: number = 0; // This will store which box is open
  isTakingBatteryAnimationShow:boolean=false;
  isInsertingBatteryAnimationShow:boolean=true;
  activeStep = 1; // Start with step-1
  private intervalId: any;
  constructor(private openBoxSignalService:OpenBoxSignalService){}

  ngOnInit(): void {
    this.fetchBoxStatus();
    this.startAnimationSequence();
  }

  fetchBoxStatus(){
    // this.openBoxSignalService.getBoxStatus.subscribe(data=>{
    //   console.log(data);
    // })
    this.openDoor=3;
  }
  closePopup(): void {
    this.close.emit(); // Emit an event to close the popup
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear interval to avoid memory leaks
  }
  startAnimationSequence(): void {
    this.intervalId = setInterval(() => {
      this.activeStep = this.activeStep < 3 ? this.activeStep + 1 : 1; // Loop through steps
    }, 15000); // Change step every 15 seconds
  }


}
