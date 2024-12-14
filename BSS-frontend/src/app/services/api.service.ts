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

  updateCurrentEmptyBox(boxNumber:string):Observable<ApiResponse<EmptyBox>>{
    const url = `${this.BASE_URL_TRANSACTIONS}/empty-box-number`;
    const body = { boxNumber };
    return this.http.put<ApiResponse<EmptyBox>>(url, body);
  }

  getCurrentEmptyBox():Observable<ApiResponse<EmptyBox>>{
    const endpoint= '/empty-box-number';
    const url = `${this.BASE_URL_TRANSACTIONS}${endpoint}`;
    return this.http.get<ApiResponse<EmptyBox>>(url);
  }

}
