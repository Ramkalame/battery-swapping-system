import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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

  openDoor: number = 0; // This will store which box is open
  isTakingBatteryAnimationShow:boolean=true;
  isInsertingBatteryAnimationShow:boolean=false;

  constructor(private openBoxSignalService:OpenBoxSignalService,){}

  ngOnInit(): void {
    this.fetchBoxStatus();
  }

  fetchBoxStatus(){
    // this.openBoxSignalService.getBoxStatus.subscribe(data=>{
    //   console.log(data);
    // })
    this.openDoor=3;
  }


}
