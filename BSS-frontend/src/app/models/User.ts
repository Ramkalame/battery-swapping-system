export class User{
    userId:string;
    userName:string;
    mobileNumber:string;
    vehicleNumber:string;
    vehicleImageUrl:string;

    constructor(){
        this.userId = ' ';
        this.userName = ' ';
        this.mobileNumber = ' ';
        this.vehicleNumber = ' ';
        this.vehicleImageUrl = ' ';
    }
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
