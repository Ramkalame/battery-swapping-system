import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, User } from '../models/User';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private userDetailsSubscription!: Subscription;
  private timeoutId!: any;
  rfId!: string;
  user?: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });
    this.getUserDetails(this.rfId);
  }
  getUserDetails(rfId: string) {
    this.userDetailsSubscription = this.apiService.getUserById(rfId).subscribe({
      next: (response: ApiResponse<User>) => {
        console.log(response.data)
        this.user = response.data;
        this.timeoutId = setTimeout(() => {
          this.router.navigate(['/dashboard', this.rfId]);
        }, 4500);
      },
      error: (error: any) => {
        this.router.navigate(['/invalid-credential']);
        console.log('Something Went Wrong');
      },
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.userDetailsSubscription?.unsubscribe();
  }
}
