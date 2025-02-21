import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiResponse, BatteryStatus, Customer } from '../models/User';
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
  private batteryStatusSubscription!: Subscription;
  private timeoutId!: any;
  rfId!: string;
  customer?: Customer;
  batteryStatus: BatteryStatus[] = [];

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
    //RFID without RF prefix added.
    this.userDetailsSubscription = this.apiService.getUserById(rfId).subscribe({
      next: (response: ApiResponse<Customer>) => {
        if(response.success){
          console.log("Customer data in user profile component: ", response.data)
        this.customer = response.data;
        // Call getAllBatteryStatus() only when user details are successfully fetched
        this.getAllBatteryStatus();
        
        }else{
          console.log("Customer not found in the database.");
        }
        
      },
      error: (error: any) => {
        this.router.navigate(['/invalid-credential']);
        console.log(error.error.message);
      },
    });
  }

  getAllBatteryStatus() {
    this.batteryStatusSubscription = this.apiService.getAllBatteryStatus().subscribe({
      next: (response: ApiResponse<BatteryStatus[]>) => {
        if (response.success) {
          this.batteryStatus = response.data;
          console.log("Battery Status Fetched: ", this.batteryStatus);

          localStorage.setItem('batteryState', JSON.stringify(this.batteryStatus));

          // Navigate to the dashboard after battery status is fetched
          this.timeoutId = setTimeout(() => {
            this.router.navigate(['/dashboard', this.rfId]);
          }, 1500);
        } else {
          console.error('Failed to fetch battery status:', response.message);
        }
      },
      error: (error) => {
        console.error(error.error.message);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.userDetailsSubscription?.unsubscribe();
    this.batteryStatusSubscription?.unsubscribe();
  }
}
