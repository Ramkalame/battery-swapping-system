import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-swapping',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './no-swapping.component.html',
  styleUrl: './no-swapping.component.css',
})
export class NoSwappingComponent {
  private timeoutId!: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/']);
    }, 7000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }
}
