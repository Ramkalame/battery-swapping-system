import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiResponse, BatteryStatus, Customer, Status } from '../models/User';
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
  private timeoutId2!: any;
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
    sessionStorage.setItem('rfId', this.rfId);
    this.getUserDetails(this.rfId);
  }
  getUserDetails(rfId: string) {
    //RFID without RF prefix added.
    this.userDetailsSubscription = this.apiService.getUserById(rfId).subscribe({
      next: (response: ApiResponse<Customer>) => {
        if (response.success) {
          console.log(
            'Customer data in user profile component: ',
            response.data
          );
          this.customer = response.data;
          // Call getAllBatteryStatus() only when user details are successfully fetched
          this.getAllBatteryStatus();
        } else {
          console.log('Customer not found in the database.');
        }
      },
      error: (error: any) => {
        this.router.navigate(['/invalid-credential']);
        console.log(error.error.message);
      },
    });
  }

  getAllBatteryStatus() {
    this.batteryStatusSubscription = this.apiService
      .getAllBatteryStatus()
      .subscribe({
        next: (response: ApiResponse<BatteryStatus[]>) => {
          if (response.success) {
            this.batteryStatus = response.data;
            console.log('Battery Status Fetched: ', this.batteryStatus);
            this.batteryStatus.sort((a, b) => {
              return (
                parseInt(a.boxNumber.substring(1)) -
                parseInt(b.boxNumber.substring(1))
              );
            });
            localStorage.setItem(
              'batteryState',
              JSON.stringify(this.batteryStatus)
            );
            this.checkIfAllBatteryIsDischarged();
            // Navigate to the dashboard after battery status is fetched
            this.timeoutId = setTimeout(() => {
              this.router.navigate(['/dashboard', this.rfId]);
            }, 6000);
          } else {
            console.error('Failed to fetch battery status:', response.message);
          }
        },
        error: (error) => {
          console.error(error.error.message);
        },
      });
  }

  checkIfAllBatteryIsDischarged() {
    this.timeoutId2 = setTimeout(() => {
      // Check if all batteryStatus values are either 0 or 1
      const allDischarged = this.batteryStatus.every(
        (status) =>
          status.batteryStatus === Status.EMPTY ||
          status.batteryStatus === Status.CHARGING
      );
      if (allDischarged) {
        console.log('All batteries are discharged. Redirecting...');
        this.router.navigate(['/no-swapping']);
      }
    }, 6000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutId2);
    this.userDetailsSubscription?.unsubscribe();
    this.batteryStatusSubscription?.unsubscribe();
  }
}
