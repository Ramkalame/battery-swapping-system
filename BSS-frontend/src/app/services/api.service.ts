import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../models/User';
import { EmptyBox } from '../models/BatteryTransaction';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL_USERS: string = 'http://localhost:8080/api/v1/users';
  private readonly BASE_URL_TRANSACTIONS: string = 'http://localhost:8080/api/v1/transactions';

  constructor(private http:HttpClient) { }

  getUserById(userId:string):Observable<User>{
    const endpoint = `/${userId}`;
    const url = `${this.BASE_URL_USERS}${endpoint}`;
    return this.http.get<User>(url);
  }

  updateCurrentEmptyBox(boxNumber:number):Observable<ApiResponse<EmptyBox>>{
    const endpoint = `/${boxNumber}`;
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.put<ApiResponse<EmptyBox>>(url,null);
  }

  getCurrentEmptyBox():Observable<ApiResponse<EmptyBox>>{
    const endpoint= '/empty-box-number';
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.get<ApiResponse<EmptyBox>>(url);
  }

}
