export class BatteryTransaction{
    serialNumber:number;
    userName:string;
    vehicleNumber:string;
    timeStamp:Date;
    noOfTransaction:number;

    constructor(){
        this.serialNumber = 0;
        this.userName = ' ';
        this.vehicleNumber = ' ';
        this.timeStamp = new Date();
        this.noOfTransaction = 0;
    }
}

export class BatteryTransactionDto{
    userName:string;
    vehicleNumber:string;
    timeStamp:Date;
    noOfTransaction:number;

    constructor(){
        this.userName = ' ';
        this.vehicleNumber = ' ';
        this.timeStamp = new Date();
        this.noOfTransaction = 0;
    }
}


export class EmptyBox {
    id: string;
    boxNumber: number;
    timestamp?:Date;

    constructor(id: string, boxNumber: number,timestamp:Date) {
        this.id = id;
        this.boxNumber = boxNumber;
        this.timestamp = timestamp;
    }
}
