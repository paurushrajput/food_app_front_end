export class Current {
   
    loginData: any;
    environment:any
    forgotData: any;
    registrationData:any;
    currentLocation:any;
    constructor() {
    }
}


export class AppProvider {
    current: Current;
    constructor() {
        this.current = new Current();
    }

}
