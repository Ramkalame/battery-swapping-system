import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL: string = 'http://localhost:8080/users';

  constructor(private http:HttpClient) { }

  getUserById(userId:string):Observable<User>{
    const endpoint = `/${userId}`;
    const url = `${this.BASE_URL}${endpoint}`;
    return this.http.get<User>(url);
  }

}
