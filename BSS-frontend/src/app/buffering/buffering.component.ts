import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { ApiResponse, BatteryStatus, Customer } from '../models/User';

@Component({
  selector: 'app-buffering',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buffering.component.html',
  styleUrl: './buffering.component.css',
})
export class BufferingComponent implements OnInit {
  private userDetailsSubscription!:Subscription;
  private batteryStatusSubscription!: Subscription;
  private timeoutId!: any;
  rfId!: string;
  batteryStatus: BatteryStatus[] = [];

  constructor(private route: ActivatedRoute, private router: Router,private apiService:ApiService) {}

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
          if(response.success){
            console.log("Customer Data in the Buffering Component: ", response.data);
            this.getAllBatteryStatus();
            this.timeoutId = setTimeout(() => {
              this.router.navigate(['/dashboard', this.rfId]);
            }, 1500);
          }
        },
        error: (error: any) => {
          this.router.navigate(['/invalid-credential'])
          console.log(error.error.message);
        },
      });
    }




    getAllBatteryStatus() {
      this.batteryStatusSubscription = this.apiService.getAllBatteryStatus().subscribe({
        next:(response: ApiResponse<BatteryStatus[]>) => {
          if (response.success) {
            this.batteryStatus = response.data;
            console.log("Battery Status Fetched: ", this.batteryStatus);
            localStorage.setItem('batteryState', JSON.stringify(this.batteryStatus));
          } else {
            console.error('Failed to fetch battery status:', response.message);
          } 
        },
        error: (error) => {
          console.error(error.error.message);
        }
      });
    }
}
