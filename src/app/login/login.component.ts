import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  permissionData: any
  loginform: FormGroup
  submitted: any = false
  formInvalid: any = false
  // data = {
  //   email: '',
  //   password: '',
  //   role_type: 0
  // }
  hide: boolean = true;

  myFunction() {
    this.hide = !this.hide;
  }
  constructor(
    private route: Router,
    public _appService: AppService,
    private fb: FormBuilder,
  ) {
    this.loginform = this.fb.group({
      emailId: ['', [Validators.required]],
      // emailId: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/)]],
      password: ['', [Validators.required]],
      //  role_type: ['', [Validators.required]],

    })
  }

  ngOnInit(): void {
    let token = localStorage.getItem('authtoken')
    if (token) {
      this.route.navigate(['/user/list'])
    }
  }
  menuItems = [
    { route: '/dashboard', icon: 'image', label: 'Dashboard', key: 'dashboard' },
    { route: '/category/list', icon: 'sell', label: 'Cuisines Management', key: 'category' },
    { route: '/amenities/list', icon: 'forum', label: 'Amenities Management', key: 'amenities' },
    { route: '/location/list', icon: 'location_on', label: 'Location Management', key: 'location' },
    { route: '/transaction/list', icon: 'receipt_long', label: 'Transaction Management', key: '' },
    { route: '/booking/list', icon: 'event_seat', label: 'Booking Management', key: 'reservation' },
    { route: '/feedback/list', icon: 'reviews', label: 'Feedback Management', key: 'review' },
    { route: '/campaign/list', icon: 'campaign', label: 'Campaign Management', key: 'campaign' },
    { route: '/banner/list', icon: 'image', label: 'Banner Management', key: 'banner' },
    { route: '/merchant/list', icon: 'business_center', label: 'Merchant Management', key: 'merchant' },
    { route: '/restaurant/list', icon: 'restaurant', label: 'Restaurant Management', key: 'restaurant' },
    { route: '/stories/list', icon: 'auto_stories', label: 'Stories Management', key: 'stories' },
    { route: '/user/list', icon: 'group', label: 'User Management', key: 'user' },
    { route: '/agent/list', icon: 'people', label: 'Agent Management', key: 'agent' },
    { route: '/config', icon: 'manufacturing', label: 'Config Management', key: 'app_config' },
    { route: '/redeem/list', icon: 'explore', label: 'Explore Management', key: 'redeem' },
    { route: '/instant/payment', icon: 'auto_stories', label: 'Instant Payment', key: 'payments' },
    { route: '/notification/list', icon: 'notifications', label: 'Notification Management', key: 'notification' },
    { route: '/notification-template/list', icon: 'description', label: 'Notification Template Management', key: 'notification-template' },
    { route: '/dialog/list', icon: 'explore', label: 'Dialog Management', key: 'dialog' },
    { route: '/build/list', icon: 'build', label: 'Build Management', key: '' },
    { route: '/role/list', icon: 'build', label: 'Role Management', key: 'role' },
    { route: '/module/list', icon: 'person_pin', label: 'Module Management', key: 'auth' },
    { route: '/permission/list', icon: 'build', label: 'Permission Management', key: 'role_permission' },
    { route: '/assign-role-permission/list', icon: 'folder_managed', label: 'Role Permission Management', key: 'user_role' },
    { route: '/user-role/list', icon: 'supervisor_account', label: 'User Role Management', key: 'role' },
    { route: '/admin/list', icon: 'build', label: 'Admin Management', key: 'role' },
    { route: '/game/list', icon: 'stadia_controller', label: 'Game Management', key: '' },
    { route: '/coupon/list', icon: 'developer_guide', label: 'Voucher Management', key: 'coupon' },
    { route: '/tournament/list', icon: 'Trophy', label: 'Tournament Management', key: 'tournament' },
    { route: '/tournament-rule/list', icon: 'military_tech', label: 'Tournament Rule Management', key: '' },
    { route: '/breakup/list', icon: 'backup', label: 'Breakup Management', key: 'breakup' },
    { route: '/deal/list', icon: 'shopping_cart', label: 'Deal Management', key: 'deal' },
    { route: '/deal-category/list', icon: 'category_search', label: 'Deal Category Management', key: 'deal' },
    { route: '/deal/history', icon: 'explore', label: 'Deal Bookings', key: 'deal' },
    { route: '/app-setting/list', icon: 'phone_iphone', label: 'App Setting Management', key: 'app_setting' },
    { route: '/deleted/users', icon: 'group_remove', label: 'Deleted Users Management', key: 'deleted_user' },
    // Add more menu items as needed
  ];
  onLogIn() {
    this.submitted = true

    if (this.loginform.invalid) {
      this.formInvalid = true
      return
    }
    this._appService.updateLoading(true)
    let data = {
      email: this.loginform.value.emailId,
      password: this.loginform.value.password,
      // role_type: Number(this.loginform.value.role_type)
    }
    this._appService.postApi("/admin/login", data, 0).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success == true) {
          this._appService.success(success.msg)
          this._appService.setToken(success.data.token);
          this._appService.setRole(success.data.role);
          this._appService.setPermission(success.data.permissions);
          let findQuery = `${success.data.role[0]['role_key']}`

          const moduleNames = Object.keys(success.data.permissions[findQuery]);
          console.log(moduleNames)

          if (moduleNames.length > 0) {

            const matchingMenuItem = this.menuItems.find(
              (item) => item.key === moduleNames[0]
            );

            if (matchingMenuItem) {
              // Navigate to the matched route
              this.route.navigate([matchingMenuItem.route]);
            } else {
              // If no match, navigate to the default route
              this.route.navigate(['/home']);
            }
          }

          else
            this.route.navigate(['/home'])
        }
        else {
          this._appService.err(success.msg)
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        this._appService.err(error.error.msg)
        console.log({ error })
      }
    })
  }

}
