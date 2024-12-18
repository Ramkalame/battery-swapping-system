import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { ApiResponse, User } from '../models/User';

@Component({
  selector: 'app-buffering',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buffering.component.html',
  styleUrl: './buffering.component.css',
})
export class BufferingComponent implements OnInit {
  private userDetailsSubscription!:Subscription;
  private timeoutId!: any;
  rfId!: string;

  constructor(private route: ActivatedRoute, private router: Router,private apiService:ApiService) {}

  ngOnInit(): void {
    // Retrieve the rfId parameter from the route
    this.route.params.subscribe((params) => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });

    this.getUserDetails(this.rfId);

    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/user-profile', this.rfId]);
    }, 1500);
  }
  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.userDetailsSubscription?.unsubscribe();
  }


   getUserDetails(rfId: string) {
      this.userDetailsSubscription = this.apiService.getUserById(rfId).subscribe({
        next: (response: ApiResponse<User>) => {
        },
        error: (error: any) => {
          this.router.navigate(['/invalid-credential'])
          console.log('Something Went Wrong');
        },
      });
    }
}
