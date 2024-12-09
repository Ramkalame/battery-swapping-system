import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('batterySwapAnimation', [
      state('closed', style({
        transform: 'scale(1)',  
        opacity: 1
      })),
      state('open', style({
        transform: 'scale(0.8)',  
      })),
      transition('closed <=> open', [
        animate('1s ease-in-out')  
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit{
  isBatteryInserted: boolean = false; 
  isBatteryCharged: boolean = false;

  isSwapping = false;  
  swapInterval: any;

  ngOnInit(): void {
    this.swapInterval = setInterval(() => {
      this.toggleSwapState();  
    }, 3000);
  }

  toggleSwapState() {
    this.isSwapping = !this.isSwapping; 
  }

}
