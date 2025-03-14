import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenBoxSignalService {

  constructor(private http:HttpClient) { }

  getBoxStatus(){
    return this.http.get<any>('/api/battery-box-status');
  }
}
