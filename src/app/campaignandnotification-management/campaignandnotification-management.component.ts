import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppService } from 'src/app.service';
import { AddRemoveNukhbaUserComponent } from '../dialog/add-remove-nukhba-user/add-remove-nukhba-user.component';
import { AddUserEmailComponent } from '../dialog/add-user-email/add-user-email.component';
import { ConfirmPilotModeComponent } from '../dialog/confirm-pilot-mode/confirm-pilot-mode.component';
import { ConfirmStatusComponent } from '../dialog/confirm-status/confirm-status.component';
import { NotiFilterComponent } from '../dialog/noti-filter/noti-filter.component';
import { ViewFcmTokenComponent } from '../dialog/view-fcm-token/view-fcm-token.component';
import { CreateDialogComponent } from '../dialog/create-dialog/create-dialog.component';

@Component({
  selector: 'app-campaignandnotification-management',
  templateUrl: './campaignandnotification-management.component.html',
  styleUrls: ['./campaignandnotification-management.component.scss']
})
export class CampaignandnotificationManagementComponent {


  ELEMENT_DATA: user[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  dialogData: any;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'fname', 'email', 'mobile', 'booking', 'campaign_id', 'last_seen', 'onboard', 'status', 'checked'];
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
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    console.log(this.data);

    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
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
      this.loadData()
    });
  }
  loadData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/users/unused-coupon-user-list?coupon_id=${this.data.couponData.id}&page=${this.currentPage + 1}&page_size=${this.pageSize}`).subscribe((res: any) => {
      if (res.status_code == '401') {
        this.router.navigateByUrl("/");
      }
      this.dataSource.data = res.data?.rows
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
      // this.isLoading = false;
    },
      (error) => {
        if (error?.error?.status_code) {
          this.router.navigateByUrl("/");
          localStorage.removeItem('authtoken');
        }
      })
  }
  submitAgent() {
    if (this.agentId) {
      this._appService.putApiWithAuth(`/admin/users/update`, {
        "user_id": this.agentId,
        "user_type": 1
      }, 1).subscribe({
        next: (success: any) => {
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
          this._appService.err(error?.error?.msg)
        }
      })
    }
  }
  submitEmails() {
    if (this.selectedIds) {
      this._appService.putApiWithAuth(`/admin/users/nukhba-user`, {
        "user_emails": this.selectedIds,
        "status": this.removeEmail ? 0 : 1
      }, 1).subscribe({
        next: (success: any) => {
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
          this._appService.err(error?.error?.msg)
        }
      })
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadDatav2();
  }

  loadDatav2() {
    let formValue = this.dialogData;
    if (formValue) {
      let keyword = formValue?.name ? formValue?.name : '';
      let status = formValue?.status ? formValue?.status : '';
      let from_date = (formValue?.from_date) != '' && (formValue?.from_date) ? moment(formValue?.from_date).format('YYYY-MM-DD') : '';
      let to_date = (formValue?.to_date) != '' && (formValue?.to_date) ? moment(formValue?.to_date).format('YYYY-MM-DD') : '';
      let campaign = formValue.campaign_title ? formValue.campaign_title : '';
      if (keyword || status) {
        this.currentPage = 0
      }
      this._appService.getApiWithAuth(`/admin/users/unused-coupon-user-list?coupon_id=${this.data.couponData.id}&campaign_title=${campaign}&from_date=${from_date}&to_date=${to_date}&page=${this.currentPage + 1}&page_size=${this.pageSize}&keyword=${keyword}`).subscribe((res: any) => {
        if (res.status_code == '401') {
          this.router.navigateByUrl("/");
        }
        this.dataSource.data = res.data?.rows
        this._appService.hideSpinner()
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = res.data?.count;
        });
        // this.isLoading = false;
      },
        (error) => {
          if (error?.error?.status_code) {
            this.router.navigateByUrl("/");
            localStorage.removeItem('authtoken');
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
    const dialogRef = this.dialog.open(NotiFilterComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        data: this.dialogData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.dialogData = result.data;
      this.loadDatav2()
    });
  }

  formReset = () => {
    // this.searchForm.reset()
    this.currentPage = 0
    this.loadData()
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
        this.loadData()
      }
    });
  }

  sendDialog(dialogData: any = {}, status: any) {
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '100',
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
}



export interface user {
  sr: string,
  fname: string,
  lname: string,
  email: string,
  Status: string,
  checked: boolean
}