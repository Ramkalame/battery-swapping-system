import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-warning-message',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './warning-message.component.html',
  styleUrl: './warning-message.component.css',
})
export class WarningMessageComponent implements OnInit {
  private timeoutId!: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/']);
    }, 4000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }
}
