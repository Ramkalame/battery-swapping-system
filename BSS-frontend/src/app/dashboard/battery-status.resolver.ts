import { ResolveFn } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Inject } from '@angular/core';

export const batteryStatusResolver: ResolveFn<boolean> = (route, state) => {

  return Inject(ApiService).getAllBatteryStatus();
};
