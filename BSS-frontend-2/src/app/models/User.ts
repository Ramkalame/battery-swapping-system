export interface Customer {
    id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    tagId: string;
    isRFIDAssigned: boolean;
    customerImage: CloudImage;
    latitude: number;
    longitude: number;
    registrationTime: string;
    role: Role;
    currentlyPluggedBatteryId: string;
    address: Address;
    vehicle: Vehicle;
  }

  export interface CloudImage{
    publicId: string;
    imgUrl: string;
  }
  
  export interface Address {
    id: string;
    streetName: string;
    cityName: string;
    districtName: string;
    zipCODE: string;
    stateName: string;
    countryName: string;
  }
  
  export interface Vehicle {
    id: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    model: string;
    brand: string;
  }
  
  export enum VehicleType {
    E_RICKSHAW = 'E_RICKSHAW',
    E_SCOOTER = 'E_SCOOTER'
  }
  
  export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
  }
  
export class ApiResponse<T> {
    data: T;
    message: string;
    timestamp: Date;
    statusCode: number;
    success: boolean;

    constructor(
        data: T,
        message: string,
        timestamp: Date,
        statusCode: number,
        success: boolean
    ) {
        this.data = data;
        this.message = message;
        this.timestamp = timestamp;
        this.statusCode = statusCode;
        this.success = success;
    }
}


export interface BatteryStatus {

    boxNumber: string;
    batteryStatus: Status;
}

export enum Status {
    EMPTY = 'EMPTY', 
    CHARGING = 'CHARGING', 
    FULL_CHARGED = 'FULL_CHARGED'
}
