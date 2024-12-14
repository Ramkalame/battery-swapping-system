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
    boxNumber: string;

    constructor(id: string, boxNumber: string) {
        this.id = id;
        this.boxNumber = boxNumber;
    }
}
