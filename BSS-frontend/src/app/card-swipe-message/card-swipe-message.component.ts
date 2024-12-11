import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-swipe-message',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './card-swipe-message.component.html',
  styleUrl: './card-swipe-message.component.css'
})
export class CardSwipeMessageComponent {

}
