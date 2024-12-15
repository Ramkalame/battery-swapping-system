import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-buffering',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buffering.component.html',
  styleUrl: './buffering.component.css',
})
export class BufferingComponent implements OnInit {
  private timeoutId!: any;
  rfId!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Retrieve the rfId parameter from the route
    this.route.params.subscribe((params) => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });

    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/dashboard', this.rfId]);
    }, 1500);
  }
  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
