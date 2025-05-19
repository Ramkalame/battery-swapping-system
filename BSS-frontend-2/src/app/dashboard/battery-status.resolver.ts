import { Inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from '../services/api.service';

export const batteryStatusResolver: ResolveFn<boolean> = (route, state) => {

  return Inject(ApiService).getAllBatteryStatus();
};
