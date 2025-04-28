import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AppService {
    private dataStorage: any = {};
    addData(key: string, data: any) {
    }
    getData(key: string) {
        // this.changed[key] = false;
        return this.dataStorage[key];
    }
    clearData(key: string) {
        this.dataStorage[key] = undefined;
    }
    httpOptions: any;
    // baseUrl = 'https://adminapi.nukhba.app/api/v1';
    baseUrl = environment.apiUrl
    evnvor = 'prod'
    arr: any = []
    constructor(
        public http: HttpClient,
        private toastr: ToastrService,
        private cookieService: CookieService,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        if (window.location.protocol == 'https:') {
            // this.baseUrl = environment.apiUrl;
            // this.baseUrl = 'https://adminapi.nukhba.app/api/v1';
            this.baseUrl = environment.apiUrl

        }
    }
    //<==============================error ======================================>

    error(response_message: any): any {
        throw new Error("Method not implemented.");
    }
    formatBytes(bytes: number, decimals = 2): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    //<===============================get api=====================================>

    getApi(url: any): Observable<any> {

        this.httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            }),
        }
        return this.http.get(this.baseUrl + url, this.httpOptions);
    }
    getConditions(URL: any): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            }),
        }
        return this.http.get(URL);
    }
    //<==============================get api with token===============================>

    getApiWithAuth(url: any): Observable<any> {
        // let token = this.cookieService.get('token');
        let token = this.getToken();
        this.httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}` ? `Bearer ${token}` : ''
            }),
        }
        return this.http.get(this.baseUrl + url, this.httpOptions);
    }
    getApiWithAuth1(url: any): Observable<any> {
        // let token = this.cookieService.get('token');
        let token = this.getToken();
        this.httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzI5MzM4NTI4LCJleHAiOjE3NjA4NzQ1Mjh9.NDsRTX-JdZltYYfN4QmL0ZbxfwhW-g77lPvCqQJu6QE`
            }),
        }
        return this.http.get("http://localhost:3003/api/v1" + url, this.httpOptions);
    }

    //<=================================form data==========================================>
    private loaderSubject = new BehaviorSubject<boolean>(false);
    public loader$ = this.loaderSubject.asObservable();
    updateLoading(loading: boolean) {
        this.loaderSubject.next(loading);
    }
    //  updateQueryParams(params: any) {
    //     // Filter out parameters with null or empty string values
    //     const filteredParams = Object.keys(params)
    //       .filter(key => params[key] !== null && params[key] !== '')
    //       .reduce((acc: any, key: any) => {
    //         acc[key] = params[key];
    //         return acc;
    //       }, {});

    //     // Navigate with the filtered parameters
    //     this.router.navigate([], {
    //       relativeTo: this.route,
    //       queryParams: filteredParams,
    //       queryParamsHandling: 'merge'
    //     });
    //   }
    updateQueryParams(params: any) {
        // Filter out parameters with null, empty strings, default page=1, and default pageSize=10
        const filteredParams = Object.keys(params)
            .filter(key => {
                const value = params[key];
                return (
                    value !== null &&
                    value !== '' &&
                    !(key === 'page' && value === 1) &&
                    !(key === 'pageSize' && value === 10)
                );
            })
            .reduce((acc: any, key: any) => {
                acc[key] = params[key];
                return acc;
            }, {});

        // Navigate with the filtered parameters
        if (Object.keys(filteredParams).length === 0) {
            // If empty, remove all query parameters
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {},
                queryParamsHandling: ''
            });
        } else {
            // Otherwise, navigate with the filtered parameters
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: filteredParams,
                queryParamsHandling: 'merge'
            });
        }
    }

    formdataApi(url: string, data: any): Observable<any> {

        let token = this.getToken();
        var httpOptions;
        httpOptions = {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` ? `Bearer ${token}` : '' }),

        }
        return this.http.post((this.baseUrl + url), data, httpOptions)
    }

    //<==================================post api===========================================>
    public isDisabled = false;

    disableButton() {
        this.isDisabled = true;
    }

    enableButton() {
        this.isDisabled = false;
    }

    isButtonDisabled(): boolean {
        return this.isDisabled;
    }
    postApi(url: any, data: any, isHeader: any): Observable<any> {
        if (!isHeader) {
            this.httpOptions = {
                headers: new HttpHeaders({ "Content-Type": "application/json" }),
            }
            return this.http.post(this.baseUrl + url, data);
        } else {
            let token = this.cookieService.get('authtoken');
            this.httpOptions = {
                headers: new HttpHeaders({ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` ? `Bearer ${token}` : '' }),
            }
            return this.http.post(this.baseUrl + url, data, { headers: this.httpOptions, withCredentials: true }

            );
        }
    }

    //<==================================put api===========================================>

    putApi(url: any, data: any, isHeader: any): Observable<any> {
        if (!isHeader) {
            this.httpOptions = {
                headers: new HttpHeaders({ "Content-Type": "application/json" }),
            }
            return this.http.put(this.baseUrl + url, data);
        } else {
            let token = this.getToken();
            this.httpOptions = {
                headers: new HttpHeaders({ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` ? `Bearer ${token}` : '' }),
            }
            return this.http.put(this.baseUrl + url, data, this.httpOptions);
        }
    }

    deleteApi(url: any, data: any, isHeader: any): Observable<any> {
        if (!isHeader) {
            this.httpOptions = {
                headers: new HttpHeaders({ "Content-Type": "application/json" }),

            }
            this.httpOptions.body = data;
            return this.http.delete(this.baseUrl + url, this.httpOptions);
        } else {
            let token = this.getToken();
            this.httpOptions = {
                headers: new HttpHeaders({ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` ? `Bearer ${token}` : '' }),

            }
            this.httpOptions.body = data;
            return this.http.delete(this.baseUrl + url, this.httpOptions);
        }
    }
    //<====================================post api with token================================>

    postApiWithAuth(url: any, data: any, isHeader: any = 0): Observable<any> {
        // console.log("======data", data);

        // let token = this.cookieService.get('token');
        let token = this.getToken();
        this.httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}` ? `Bearer ${token}` : ''
                // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6NiwiaWF0IjoxNjk3MjAwNDAwLCJleHAiOjE3Mjg3MzY0MDB9.4ipFcHGxDbhTV6vjBlLIyB3hRgGEkKGdIWYZiO6b-nA' ? 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6NiwiaWF0IjoxNjk3MjAwNDAwLCJleHAiOjE3Mjg3MzY0MDB9.4ipFcHGxDbhTV6vjBlLIyB3hRgGEkKGdIWYZiO6b-nA' : ''
            })
        }
        return this.http.post(this.baseUrl + url, data, this.httpOptions);
    }
    postDataFormData(url: any, data: any, isHeader: any = 0): Observable<any> {
        // console.log("======data", data);

        // let token = this.cookieService.get('token');
        let token = this.getToken();
        this.httpOptions = {
            headers: new HttpHeaders({
                //"Content-Type": "application/json",
                'Authorization': `Bearer ${token}` ? `Bearer ${token}` : ''
            })
        }
        return this.http.post(this.baseUrl + url, data, this.httpOptions);
    }


    putApiWithAuth(url: any, data: any, isHeader: any = 0): Observable<any> {
        // let token = this.cookieService.get('token');
        let token = this.getToken();
        this.httpOptions = {
            headers: new HttpHeaders({
                // "Content-Type": "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}` ? `Bearer ${token}` : ''
            })
        }
        return this.http.put(this.baseUrl + url, data, this.httpOptions);
    }
    putApiWithHeaderAuth(url: any, data: any, isHeader: any = 0): Observable<any> {
        // let token = this.cookieService.get('token');
        let token = this.getToken();
        this.httpOptions = {
            headers: new HttpHeaders({
                // "Content-Type": "application/json",
                //   "Content-Type": "application/json",
                'Authorization': `Bearer ${token}` ? `Bearer ${token}` : ''
            })
        }
        return this.http.put(this.baseUrl + url, data, this.httpOptions);
    }
    postApiWithAuthentication(url: any, data: any, isHeader: any = 0): Observable<any> {
        let token = this.getToken();
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}` ? `Bearer ${token}` : ''
            })
        }
        return this.http.post(this.baseUrl + url, data, this.httpOptions);
    }

    //<=====================================get location==========================================>

    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resp => {
                resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
            },
                err => {
                    reject(err);
                });
        });
    }

    //<====================================remember me ===================================================>

    IsRememberMe(rmCheck: any, model: any) {
        if (rmCheck.checked == false) {
            console.log("*****")
        } else {
            this.cookieService.set('emailId', model.email);
            this.cookieService.set('password', model.password);
        }
    }

    //<=================================token====================================================>

    setToken(token: string) {
        localStorage.setItem('authtoken', token);
    }
    setRole(role: string) {
        localStorage.setItem('setRole', JSON.stringify(role));
    }
    setPermission(permission: string) {
        localStorage.setItem('setPermission', JSON.stringify(permission));
        this.permissionData.next(permission);
    }

    private permissionData = new BehaviorSubject<any>(null); // BehaviorSubject to hold permission data

    // Expose permissions as an observable
    getPermissionData() {
        return this.permissionData.asObservable();
    }
    getToken() {
        return localStorage.getItem('authtoken');
    }
    getRole() {
        return JSON.parse(localStorage.getItem('setRole') || '{}');
    }
    getPermission() {
        return JSON.parse(localStorage.getItem('setPermission') || '{}');
    }
    removeToken() {
        return localStorage.removeItem('authtoken');
    }

    clearLocalStorage() {
        return localStorage.clear();
    }

    // =================================spinner==============================================>
    mergeDeletedUsersWithData(
        userIds: string,
        filteredData: any[],
        dataSource: any,
        paginator: any,
        currentPage: number,
        totalRecords: number
    ) {
        
        this.postApiWithAuth('/admin/deleted-users/list-by-id', { 'user_ids': userIds }).subscribe((deletedUsersRes: any) => {

            // Step 4: Merge the usernames with the filtered data
            const mergedData = filteredData.map((row: any) => {
                const matchedUser = deletedUsersRes.data.deleted_users.find((user: any) => user.user_id == row.user_id);
                return {
                    ...row,
                    username: matchedUser ? matchedUser?.user_name + "<span class='Red'> (Deleted)</span>" : row.username,
                    user_email: matchedUser ? matchedUser?.user_email  : row.user_email,
                    user_mobile:matchedUser?matchedUser?.user_mobile:row.user_mobile
                };
            });

            // Step 5: Assign the merged data (with usernames) to the dataSource
            dataSource.data = mergedData;

            // Step 6: Hide spinner and update paginator
            this.hideSpinner();
            setTimeout(() => {
                paginator.pageIndex = currentPage;
                paginator.length = totalRecords;
            });

        }, (error) => {
            console.error('Error fetching deleted user data:', error);
            this.hideSpinner();
        });
    }

    showSpinner() {
        // this.spinner.show()
        this.updateLoading(true)
    }
    hideSpinner() {
        //  this.spinner.hide()
        this.updateLoading(false)
    }

    //================================================toastr=====================================>

    success(msg: any) {
        this.toastr.success(msg)
    }

    err(msg: any) {
        this.toastr.error(msg)
    }

    covertNumberToDecimal = (number: any) => {
        // return Math.round(number * 10) / 10;
        return Math.round(number * 100) / 100
    }

    nonNullValues = (obj: any) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([key, value]) => value !== '')
        )
    }

    removeQueryParams = () => {
        this.router.navigate(
            [],
            { relativeTo: this.route, queryParams: {} }
        );
    }
    // updateQueryParams(_route: string, params: Object) {
    //     this.router.navigate([_route], { relativeTo: this.route, queryParams: { ...params } });
    // }

    formatThousand = (num: any) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getMonths = (num: any) => {
        let month
        switch (num) {
            case 0:
                month = "Jan";
                break;
            case 1:
                month = "Feb";
                break;
            case 2:
                month = "Mar";
                break;
            case 3:
                month = "Apr";
                break;
            case 4:
                month = "May";
                break;
            case 5:
                month = "June";
                break;
            case 6:
                month = "July";
                break;
            case 7:
                month = "Aug";
                break;
            case 8:
                month = "Sep";
                break;
            case 9:
                month = "Oct";
                break;
            case 10:
                month = "Nov";
                break;
            case 11:
                month = "Dec";
                break;
            default:
                month = "Invalid month";
        }
        return month;
    }

}
