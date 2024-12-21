import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../models/User';
import { BatteryStatus, BatteryTransaction, EmptyBox } from '../models/BatteryTransaction';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly BASE_URL_USERS: string =
    'http://localhost:8080/api/v1/users';
  private readonly BASE_URL_TRANSACTIONS: string =
    'http://localhost:8080/api/v1/transactions';
  private readonly BASE_URL_ARDUINO: string =
    'http://localhost:8080/api/v1/arduino';

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<ApiResponse<User>> {
    const endpoint = `/${userId}`;
    const url = `${this.BASE_URL_USERS}${endpoint}`;
    return this.http.get<ApiResponse<User>>(url);
  }

  updateCurrentEmptyBox(boxNumber: number): Observable<ApiResponse<EmptyBox>> {
    const endpoint = `/empty-box-number/${boxNumber}`;
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.put<ApiResponse<EmptyBox>>(url, null);
  }

  getCurrentEmptyBox(): Observable<ApiResponse<EmptyBox>> {
    const endpoint = '/empty-box-number';
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.get<ApiResponse<EmptyBox>>(url);
  }

  //Method to send command to the solenoid
  sendCommandToArduino(command: string): Observable<ApiResponse<string>> {
    const endpoint = `/${command}`;
    const url = `${this.BASE_URL_ARDUINO}${endpoint}`;
    return this.http.post<ApiResponse<string>>(url, null);
  }

  //api call method to store the transaction of battey
  addBatteryTransactions(rfId:string):Observable<ApiResponse<BatteryTransaction>>{
    const endpoint = `/${rfId}`;
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.post<ApiResponse<BatteryTransaction>>(url, null);
  }

  //api to get all battery status
  getAllBatteryStatus(): Observable<ApiResponse<BatteryStatus[]>>{
    const endpoint = '/battery-status';
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.get<ApiResponse<BatteryStatus[]>>(url);
  }


   //api to update the battery status
   updateBatteryStatus(data:BatteryStatus): Observable<ApiResponse<BatteryStatus>>{
    const endpoint = '/battery-status';
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.put<ApiResponse<BatteryStatus>>(url,data);
  }
  
}
