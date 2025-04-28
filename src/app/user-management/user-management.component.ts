import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { ConfirmStatusComponent } from '../dialog/confirm-status/confirm-status.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPilotModeComponent } from '../dialog/confirm-pilot-mode/confirm-pilot-mode.component';
import { UserFilterComponent } from '../dialog/user-filter/user-filter.component';
import { AddRemoveNukhbaUserComponent } from '../dialog/add-remove-nukhba-user/add-remove-nukhba-user.component';
import { ViewFcmTokenComponent } from '../dialog/view-fcm-token/view-fcm-token.component';
import * as moment from 'moment';
import { AddUserEmailComponent } from '../dialog/add-user-email/add-user-email.component';
import { CreateDialogComponent } from '../dialog/create-dialog/create-dialog.component';
import * as momentv1 from 'moment-timezone';
import { ViewUserDetailsComponent } from '../dialog/view-user-details/view-user-details.component';
import { ViewCoinHistoryComponent } from '../dialog/view-coin-history/view-coin-history.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  totalSignedupUser: any = {};
  uuidArray: any = [];
  userlist: any
  userListCount: any
  agentDetails: any
  userDetail: any;
  totalVerifiedUser: any = {}
  ELEMENT_DATA: user[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  dialogData: any;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'fname', 'username', 'email', 'mobile', 'booking', 'campaign_id', 'points', 'onboard', 'last_login', 'last_seen', 'signedupUser', 'verifiedUser', 'status', 'actionv2', 'checked'];
  dataSource: MatTableDataSource<user> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search by Name /Email',
      label: 'Search by Name /Email'
    },
    date: {
      controls: { startDate: 'startDate', endDate: 'endDate' },
      placeholder: 'Enter date range',
      label: 'Select Date'
    },
    pagination: {
      page: 1,
      pageSize: 10,
    }
  }
  removeEmail: boolean = false;
  agentId: any;
  constructor(
    public _appService: AppService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      status: [''],
      booking_count: [''],
      from_date: [''],
      to_date: [''],
      is_nukhba_user: ['0'],
      campaign_title: [''],
      user_invites_status: [''],
      country_code: [''],
      referred_by: [''],
      is_pilot: ['0'],
      device_id: [''],
      referral_count: [''],
      allow_referral: [''],
      allow_campaign: ['']
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      name: params.get('name') || '',
      status: params.get('status') || '',
      booking_count: params.get('booking_count') || '',
      from_date: params.get('from_date') || '',
      to_date: params.get('to_date') || '',
      campaign_title: params.get('campaign_title') || '',
      user_invites_status: params.get('user_invites_status') || '',
      country_code: params.get('country_code') || '',
      is_nukhba_user: params.get('is_nukhba_user') || '0',
      is_pilot: params.get('is_pilot') || '0',
      referred_by: params.get('referred_by'),
      device_id: params.get('device_id'),
      referral_count: params.get('referral_count'),
      allow_referral: params.get('allow_referral'),
      allow_campaign: params.get('allow_campaign'),
    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  dateCutv2(str: any) {
    if (str) {
      let sendStr = str.slice(0, 10) + ' ' + str.slice(11, 16);
      return sendStr;
    } else {
      return 'N/A'
    }
  }

  onSelectAllCheckboxClick() {
    // Update the state of all checkboxes based on the state of "Select All" checkbox
    this.dataSource.data.map((item: any) => {
      item.checked = this.selectAllValue;
    });
    if (this.selectAllValue) {
      this.selectedIds = this.dataSource.data
        .filter((item: any) => !item.is_nukhba_user)
        .map((item: any) => item.email)
        .join(',');

      console.log(this.selectedIds)
    } else {
      this.selectedIds = '';
    }
  }
  selectedIds: any
  checkboxValue: any = false
  selectAllValue: boolean = false;
  onCheckboxClick(element: any) {
    // Make your API call here
    if (element.checked) {
      // Add the email to selectedIds if the checkbox is checked
      if (!this.selectedIds) {
        this.selectedIds = element.email;
      } else {
        this.selectedIds += ',' + element.email;
      }
    } else {
      // Remove the email from selectedIds if the checkbox is unchecked
      const emailArray = this.selectedIds.split(',');
      const index = emailArray.indexOf(element.email);
      if (index !== -1) {
        emailArray.splice(index, 1);
        this.selectedIds = emailArray.join(',');
      }
    }
    console.log(this.selectedIds)
  }
  addNukhbaUser(element: any) {
    const dialogRef = this.dialog.open(AddRemoveNukhbaUserComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        message: "Are you sure you want to add Test User?",
        title: "Add Test User",
        label: "Add"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedIds = element.email
        this.submitEmails()
      }
    });
  }
  sendDialog(dialogData: any = {}, status: any) {
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      hasBackdrop: false,
      width: '575px',
      height: '100',
      data: {
        dialogData: dialogData,
        status: status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
  addAgent(element: any) {
    const dialogRef = this.dialog.open(AddRemoveNukhbaUserComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        message: "Are you sure you want to add agent to this user?",
        title: "Add Agent User",
        label: "Add"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.agentId = element.id
        this.submitAgent()
      }
    });
  }
  removeNukhbaUser(element: any) {
    const dialogRef = this.dialog.open(AddRemoveNukhbaUserComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        message: "Are you sure you want to remove Test User?",
        title: "Remove Test User",
        label: "Remove"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedIds = element.email
        this.removeEmail = true
        this.submitEmails()
      }
    });

  }
  ViewFCMToken(element: any) {
    const dialogRef = this.dialog.open(ViewFcmTokenComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        fcmtoken: element.fcm_token
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
  loadData() {
    this._appService.showSpinner()
    let formValue = this.searchForm.value;
    if (formValue) {
      let keyword = formValue?.name ? formValue?.name : '';
      let status = formValue?.status ? formValue?.status : '';
      let booking_count = formValue?.booking_count;
      let from_date = (formValue?.from_date) != '' && (formValue?.from_date) ? moment(formValue?.from_date).format('YYYY-MM-DD') : '';
      // let formattedNextDate=''
      // if (from_date) {
      //   let currentDate = moment(from_date);
      //   let nextDate = currentDate.subtract(1, 'day');
      //   formattedNextDate = nextDate.format('YYYY-MM-DD');
      // }
      let to_date = (formValue?.to_date) != '' && (formValue?.to_date) ? moment(formValue?.to_date).format('YYYY-MM-DD') : '';
      let campaign = formValue.campaign_title ? formValue.campaign_title : '';
      let user_invites_status = formValue.user_invites_status ? formValue.user_invites_status : '';
      let country_code = formValue.country_code ? formValue.country_code : ''
      let referred_by = formValue.referred_by ? formValue.referred_by : '';
      let device_id = formValue.device_id ? formValue.device_id : '';
      let referral_count = formValue.referral_count ? formValue.referral_count : '';
      let allow_referral = formValue.allow_referral ? formValue.allow_referral : '';
      let allow_campaign = formValue.allow_campaign ? formValue.allow_campaign : '';
      let is_nukhba_user = formValue?.is_nukhba_user || '0';
      let is_pilot = formValue?.is_pilot || '0';
      let query = ''
      if (allow_referral) {
        query += `&allow_referral=${allow_referral}`
      }
      if (allow_campaign) {
        query += `&allow_campaign=${allow_campaign}`
      }
      if (booking_count) {
        query += `&booking_count=${booking_count}`
      }
      if (is_nukhba_user) {
        query += `&is_nukhba_user=${is_nukhba_user}`
      }
      if (is_pilot) {
        query += `&is_pilot=${is_pilot}`
      }
      if (referral_count) {
        query += `&total_signedup_user=${referral_count}`
      }
      const params = this.buildQueryParams()
      this._appService.updateQueryParams(params)
      this._appService.getApiWithAuth(`/admin/users/list?device_id=${device_id}&referred_by=${referred_by}&country_code=${country_code}&user_invites_status=${user_invites_status}&campaign_title=${campaign}&from_date=${from_date}&to_date=${to_date}&status=${status}&page=${this.currentPage + 1}&page_size=${this.pageSize}&search=${keyword}${query}`).subscribe((res: any) => {
        if (res.status_code == '401') {
          this.router.navigateByUrl("/");
        }
        this.userlist = res.data?.rows
        this.userListCount = res.data?.count
        // this.dataSource.data = res.data?.rows
        this.uuidArray = []
        if (res.data?.rows.length > 0) {
          res.data?.rows.map((element: any) => {
            if (element.id)
              this.uuidArray.push(element.id)
          });
          this.getAgentDetails(this.uuidArray)
        } else {
          this.dataSource.data = res.data?.rows
        }
        this._appService.hideSpinner()

        // this.isLoading = false;
      },
        (error) => {
          if (error?.error?.success == false) {
            this._appService.err(error?.error?.msg)
          }
          if (error?.error?.status_code == 401) {
            localStorage.removeItem('authtoken')
            this.router.navigateByUrl("/");
          }
        })
    }
  }
  submitAgent() {
    this._appService.updateLoading(true)
    if (this.agentId) {
      this._appService.putApiWithAuth(`/admin/users/update`, {
        "user_id": this.agentId,
        "user_type": 1
      }, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.loadData()
            this.agentId = ''

          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          console.log({ error })
          this._appService.updateLoading(false)
          this._appService.err(error?.error?.msg)
        }
      })
    }
  }
  submitEmails() {
    this._appService.updateLoading(true)
    if (this.selectedIds) {
      this._appService.putApiWithAuth(`/admin/users/nukhba-user`, {
        "user_emails": this.selectedIds,
        "status": this.removeEmail ? 0 : 1
      }, 1).subscribe({

        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.loadData()
            this.selectedIds = ''
            this.removeEmail = false
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          console.log({ error })
          this._appService.updateLoading(false)
          this._appService.err(error?.error?.msg)
        }
      })
    } else {
      this._appService.updateLoading(false)
      this._appService.err(`Don't have email Id `)
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadDatav2();
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    const status = this.searchForm.value.status || '';
    const booking_count = this.searchForm.value.booking_count || '';
    const paymentMode = this.searchForm.value.paymentMode || '';
    const from_date = this.searchForm.value.from_date || '';
    const to_date = this.searchForm.value.to_date || '';
    const campaign_title = this.searchForm.value.campaign_title || '';
    const user_invites_status = this.searchForm.value.user_invites_status || '';
    const is_nukhba_user = this.searchForm.value.is_nukhba_user;
    const is_pilot = this.searchForm.value.is_pilot;
    const country_code = this.searchForm.value.country_code || '';
    const referred_by = this.searchForm.value.referred_by
    const device_id = this.searchForm.value.device_id
    const referral_count = this.searchForm.value.referral_count
    const allow_campaign = this.searchForm.value.allow_campaign
    const allow_referral = this.searchForm.value.allow_referral
    return {
      name,
      is_pilot,
      status,
      is_nukhba_user,
      booking_count,
      paymentMode,
      from_date,
      to_date,
      campaign_title,
      user_invites_status,
      country_code,
      referred_by,
      device_id,
      referral_count,
      allow_campaign,
      allow_referral,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  loadDatav2() {
    let formValue = this.dialogData;
    if (formValue) {
      let keyword = formValue?.name ? formValue?.name : '';
      let status = formValue?.status ? formValue?.status : '';
      let booking_count = formValue?.booking_count;
      let from_date = (formValue?.from_date) != '' && (formValue?.from_date) ? moment(formValue?.from_date).format('YYYY-MM-DD') : '';
      // let formattedNextDate = ''
      // if (from_date) {
      //   let currentDate = moment(from_date);
      //   let nextDate = currentDate.subtract(1, 'day');
      //   formattedNextDate = nextDate.format('YYYY-MM-DD');
      // }
      let to_date = (formValue?.to_date) != '' && (formValue?.to_date) ? moment(formValue?.to_date).format('YYYY-MM-DD') : '';
      let campaign = formValue.campaign_title ? formValue.campaign_title : '';
      let user_invites_status = formValue.user_invites_status ? formValue.user_invites_status : '';
      let country_code = formValue.country_code ? formValue.country_code : '';
      let referred_by = formValue.referred_by ? formValue.referred_by : ''
      let device_id = formValue.device_id ? formValue.device_id : ''
      let referral_count = formValue.referral_count ? formValue.referral_count : '';
      let allow_referral = formValue.allow_referral ? formValue.allow_referral : '';
      let allow_campaign = formValue.allow_campaign ? formValue.allow_campaign : '';
      let is_nukhba_user = formValue?.is_nukhba_user;
      let is_pilot = formValue?.is_pilot;
      let query = ''
      if (allow_referral) {
        query += `&allow_referral=${allow_referral}`
      }
      if (allow_campaign) {
        query += `&allow_campaign=${allow_campaign}`
      }
      if (booking_count) {
        query += `&booking_count=${booking_count}`
      }
      if (is_nukhba_user) {
        query += `&is_nukhba_user=${is_nukhba_user}`
      }
      if (is_pilot) {
        query += `&is_pilot=${is_pilot}`
      }
      if (referral_count) {
        query += `&total_signedup_user=${referral_count}`
      }
      this.searchForm.patchValue(this.dialogData)
      this.searchForm.patchValue({ from_date: from_date })
      this.searchForm.patchValue({ to_date: to_date })
      const params = this.buildQueryParams()
      this._appService.updateQueryParams(params)
      this._appService.getApiWithAuth(`/admin/users/list?device_id=${device_id}&referred_by=${referred_by}&country_code=${country_code}&user_invites_status=${user_invites_status}&campaign_title=${campaign}&from_date=${from_date}&to_date=${to_date}&status=${status}&page=${this.currentPage + 1}&page_size=${this.pageSize}&search=${keyword}${query}`).subscribe((res: any) => {
        if (res.status_code == '401') {
          this.router.navigateByUrl("/");
        }
        // this.dataSource.data = res.data?.rows
        this.userlist = res.data?.rows
        this.userListCount = res.data?.count
        this.uuidArray = []
        if (res.data?.rows.length > 0) {
          res.data?.rows.map((element: any) => {
            if (element.id)
              this.uuidArray.push(element.id)
          });
          this.getAgentDetails(this.uuidArray)
        } else {
          this.dataSource.data = res.data?.rows
        }
        this._appService.hideSpinner()
        // this.isLoading = false;
      },
        (error) => {
          if (error?.error?.success == false) {
            this._appService.err(error?.error?.msg)
          }
          if (error?.error?.status_code == 401) {
            localStorage.removeItem('authtoken')
            this.router.navigateByUrl("/");
          }
        })
    } else {
      this.loadData()
    }
  }
  addUserEmail() {
    const dialogRef = this.dialog.open(AddUserEmailComponent, {
      hasBackdrop: false,
      width: "575px",

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result.data) {
        this.selectedIds = result.data;
        this.submitEmails()
      }


    });
  }
  userFilter() {
    const dialogRef = this.dialog.open(UserFilterComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        data: this.dialogData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      }
    });
  }
  viewUserDetails(data: any = {}) {
    const dialogRef = this.dialog.open(ViewUserDetailsComponent, {
      hasBackdrop: false,
      width: "575px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      }
    });
  }

  viewCoinHistory(data: any = {}) {
    const dialogRef = this.dialog.open(ViewCoinHistoryComponent, {
      hasBackdrop: false,
      width: '800px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      }
    });
  }

  formReset = () => {
    this.searchForm.reset()
    this.currentPage = 0
    this.loadData()
    if (this.dialogData) {
      this.emptyObject()
    }
  }
  emptyObject = () => {
    Object.keys(this.dialogData).forEach(key => {
      this.dialogData[key] = '';
    });
  }

  convertToGST(timestamp: number): string {
    const utcMoment = momentv1.utc(timestamp * 1000); // Convert seconds to milliseconds
    const gstMoment = utcMoment.tz('Asia/Dubai');
    return gstMoment.format('d-MMM-YY hh:mm a');
  }

  changeStatus(userData: any = {}, status: any) {
    console.log(userData);
    const dialogRef = this.dialog.open(ConfirmStatusComponent, {
      hasBackdrop: false,
      width: '50',
      height: '100',
      data: {
        userData: userData,
        status: status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadDatav2()
      }
    });
  }

  changePilotStatus(userData: any = {}, status: any) {
    console.log(userData);
    const dialogRef = this.dialog.open(ConfirmPilotModeComponent, {
      hasBackdrop: false,
      width: '50',
      height: '100',
      data: {
        userData: userData,
        status: status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadDatav2()
    });
  }

  dateCut(str: any) {
    if (str) {
      return str.slice(0, 9)
    } else {
      return 'N/A'
    }
  }

  checkSearchText(event: KeyboardEvent) {
    console.log(this.searchForm.value)
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
    if (event.key === "Enter") {
      // If the search text is not empty, then loadData is called
      if (this.searchTextNotEmpty) {
        this.loadData();
      }
      // Prevent any further execution
      return;
    }
    // If it's not Enter key, no need to load data, just update the searchTextNotEmpty flag
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
  }

  onSearch(searchText: string) {
    // Handle search logic here
    this.searchForm.patchValue({ name: searchText })

    this.loadData();
  }


  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.loadData();
    // Handle clear search logic here
  }

  async getAgentDetails(uuid: any[]) {
    let payload = {
      'uids': uuid
    }
    this._appService.postApiWithAuth(`/admin/users/other-details`, payload).subscribe({
      next: (success: any) => {
        console.log(success)
        if (success.status_code == 200) {
          this.agentDetails = success.data
          this.concatArrays()
          // if (success.data.length > 0) {
          //   success.data.forEach((x: any) => {
          //     this.totalSignedupUser[x.user_id] = x.total_signedup_user
          //   })
          // }
          // console.log('=====', this.totalSignedupUser);
          // if (success.data.totWithdrawal.length > 0) {
          //   success.data.totWithdrawal.forEach((x: any) => {
          //     this.totalSignedupUser[x.uId] = x.totalWithdrawal
          //   })
          // }
        } else {
        }

      },
      error: (error: any) => {
      }
    })
  }



  concatArrays() {
    this.userlist.forEach((item1: any) => {
      // Find matching item in the second array based on id
      let matchingItem = this.agentDetails.find((item2: any) => item2.user_id === item1.id);
      if (matchingItem) {
        // Push new keys (or merge the objects)
        Object.assign(item1, matchingItem);
      }
    });
    this.dataSource.data = this.userlist
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length = this.userListCount
    });
  }

  // getDetails(id: any) {
  //   const result = this.agentDetails.filter((item: any) => item.user_id === id);
  //   if (result) {
  //     return result
  //   } else {
  //     return {
  //       total_signedup_user: 0,
  //       total_verified_user: 0
  //     }
  //   }
  // }
}



export interface user {
  sr: string,
  fname: string,
  lname: string,
  email: string,
  Status: string,
  checked: boolean
}