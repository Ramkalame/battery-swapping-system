export class User{
    userId:string;
    userName:string;
    mobileNumber:string;
    vehicleNumber:string;
    profileImageUrl:string;
    userType: UserType;

    constructor(){
        this.userId = ' ';
        this.userName = ' ';
        this.mobileNumber = ' ';
        this.vehicleNumber = ' ';
        this.profileImageUrl = ' ';
        this.userType = UserType.SCOOTER;
    }
}

export enum UserType {
    SCOOTER = "SCOOTER",
    RICKSHAW = "RICKSHAW",
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
