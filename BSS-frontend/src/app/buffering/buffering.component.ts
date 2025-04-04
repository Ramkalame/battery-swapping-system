import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { ApiResponse, BatteryStatus, Customer, Status } from '../models/User';

@Component({
  selector: 'app-buffering',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buffering.component.html',
  styleUrl: './buffering.component.css',
})
export class BufferingComponent implements OnInit {
  private userDetailsSubscription!: Subscription;
  private batteryStatusSubscription!: Subscription;
  private timeoutId!: any;
  private timeoutId2!:any;
  rfId!: string;
  batteryStatus: BatteryStatus[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Retrieve the rfId parameter from the route
    this.route.params.subscribe((params) => {
      this.rfId = params['rfId']; // Access the rfId parameter
    });
    this.getUserDetails(this.rfId);
  }
  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.userDetailsSubscription?.unsubscribe();
  }

  getUserDetails(rfId: string) {
    this.userDetailsSubscription = this.apiService.getUserById(rfId).subscribe({
      next: (response: ApiResponse<Customer>) => {
        if (response.success) {
          console.log(
            'Customer Data in the Buffering Component: ',
            response.data
          );
          this.getAllBatteryStatus();
          this.checkIfAllBatteryIsDischarged();
          this.timeoutId = setTimeout(() => {
            this.router.navigate(['/dashboard', this.rfId]);
          }, 6000);
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
              return parseInt(a.boxNumber.substring(1)) - parseInt(b.boxNumber.substring(1));
            });
            localStorage.setItem(
              'batteryState',
              JSON.stringify(this.batteryStatus)
            );
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
    }, 5000);
  }

}
