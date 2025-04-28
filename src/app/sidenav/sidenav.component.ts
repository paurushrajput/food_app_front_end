import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ConfirmLogoutComponent } from '../dialog/confirm-logout/confirm-logout.component';
import { MatDialog } from '@angular/material/dialog';
// import {MatSidenavModule} from '@angular/material/sidenav';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  // imports: [MatSidenavModule],
})
export class SidenavComponent {
  isReportModuleAvailable: any
  isRoleModuleAvailable: any
  permissionData: any
  apiResponse: any
  showFiller = false;
  findQuery: any
  @Input('isExpanded') isExpanded: any = false
  superAdminRoleKey: any;
  isRolMenuVisible: boolean = false;
  isSocialMenuVisible: boolean = false;

  rolefilterSubmenuItems: any[] = [];
  constructor(private route: Router,
    private service: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder) {
    const roles = this.service.getRole()
    this.superAdminRoleKey = roles ? roles.find((role: any) => role.role_key === "super_admin")?.role_key : "";
    this.getPermissions()
  }
  searchTerm: string = '';


  menuItems = [
    { route: '/dashboard', icon: 'image', label: 'Dashboard', key: 'dashboard' },
    { route: '/category/list', icon: 'sell', label: 'Cuisines Management', key: 'category' },
    { route: '/amenities/list', icon: 'forum', label: 'Amenities Management', key: 'amenities' },
    { route: '/location/list', icon: 'location_on', label: 'Location Management', key: 'location' },
    { route: '/transaction/list', icon: 'receipt_long', label: 'Transaction Management', key: 'transactions' },
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
    { route: '/build/list', icon: 'build', label: 'Build Management', key: 'build' },
    { route: '/ways/earn', icon: 'person_pin', label: 'Ways To Earn Management', key: 'role' },
    { route: '/influencer/list', icon: 'phone_iphone', label: 'Influencer Management', key: 'influencer' },
    // { route: '/role/list', icon: 'person_pin', label: 'Role Management', key: 'role' },
    // { route: '/module/list', icon: 'folder_managed', label: 'Module Management', key: 'auth' },
    // { route: '/permission/list', icon: 'folder_supervised', label: 'Permission Management', key: 'role_permission' },
    // { route: '/assign-role-permission/list', icon: 'manage_accounts', label: 'Role Permission Management', key: 'user_role' },
    // { route: '/user-role/list', icon: 'build', label: 'User Role  Management', key: 'role' },
    // { route: '/admin/list', icon: 'shield_person', label: 'Admin Management', key: 'role' },
    { route: '/game/list', icon: 'stadia_controller', label: 'Game Management', key: 'game' },
    { route: '/coupon/list', icon: 'developer_guide', label: 'Voucher Management', key: 'coupon' },
    { route: '/tournament/list', icon: 'Trophy', label: 'Tournament Management', key: 'tournament' },
    { route: '/tournament-rule/list', icon: 'military_tech', label: 'Tournament Rule Management', key: '' },
    { route: '/cashout/request', icon: 'explore', label: 'Cashout Request Management', key: 'cashout' },
    { route: '/tournament-rule/list', icon: 'military_tech', label: 'Tournament Rule Management', key: 'tournament-rule' },
    { route: '/convert/history', icon: 'explore', label: 'Convert History Management', key: 'dialog' },
    { route: '/breakup/list', icon: 'backup', label: 'Breakup Management', key: 'breakup' },
    { route: '/deal/list', icon: 'shopping_cart', label: 'Deal Management', key: 'deal' },
    { route: '/deal-category/list', icon: 'category_search', label: 'Deal Category Management', key: 'deal-category' },
    { route: '/deal/history', icon: 'explore', label: 'Deal Bookings', key: 'deal-history' },
    { route: '/app-setting/list', icon: 'phone_iphone', label: 'App Setting Management', key: 'app_setting' },
    { route: '/deleted/users', icon: 'group_remove', label: 'Deleted Users Management', key: 'deleted_user' },
    { route: '/gift-goodies/list', icon: 'assignment_turned_in', label: 'Gift & Goodies Management', key: 'gift_goodies' },
    { route: '/gift-goodies-redeem/list', icon: 'assignment_turned_in', label: 'Gift & Goodies Redeem Management', key: 'gift_goodies_redeem' },



  ];
  roleSubmenuItems = [
    { route: '/admin/list', icon: 'shield_person', label: 'Admin Management', color: '#e96a20', key: 'role' },
    { route: '/role/list', icon: 'assignment_ind', label: 'Role Management', color: '#1eca2c' },
    { route: '/module/list', icon: 'folder_managed', label: 'Module Management', color: '#397de4' },
    { route: '/permission/list', icon: 'folder_supervised', label: 'Permission Management', color: '#397de4' },
    { route: '/assign-role-permission/list', icon: 'settings_account_box', label: 'User Role Management', color: '#a539e4' }
  ];
  // In your component.ts file
  reportMenuItems = [
    {
      label: 'Active Campaign',
      route: '/active-campaign/report',
      iconColor: '#e96a20',
      iconName: 'explore',
      key: "report"
    },
    {
      label: 'Campaign Report',
      route: '/campaign/report',
      iconColor: '#1eca2c',
      iconName: 'notifications',
      key: "report"
    },
    // Add more report items as needed
  ];

  socialMenuItems = [
    {
      label: 'Post List',
      route: '/post/list',
      iconColor: '#e96a20',
      iconName: 'post_add',
      key: "report"
    },
    {
      label: 'Restaurant List',
      route: '/social-restaurant/list',
      iconColor: '#e96a20',
      iconName: 'flatware',
      key: "report"
    },
    {
      label: 'Suggested Price List',
      route: '/price/list',
      iconColor: '#e96a20',
      iconName: 'flatware',
      key: "report"
    },
    {
      label: 'Suggested Cuisines List',
      route: '/cuisines/list',
      iconColor: '#e96a20',
      iconName: 'flatware',
      key: "report"
    },
    {
      label: 'Comment Report List',
      route: '/comment/report',
      iconColor: '#e96a20',
      iconName: 'brightness_alert',
      key: "report"
    },
    {
      label: 'User Report List',
      route: '/user/report',
      iconColor: '#e96a20',
      iconName: 'brightness_alert',
      key: "report"
    },
    {
      label: 'Rating Report List',
      route: '/rating/report',
      iconColor: '#e96a20',
      iconName: 'brightness_alert',
      key: "report"
    },
    {
      label: 'Wishlist Report List',
      route: '/wishlist/report',
      iconColor: '#e96a20',
      iconName: 'brightness_alert',
      key: "report"
    },
    // Add more report items as needed
  ];

  reportFilterSubmneu: any[] = []
  socialFilterSubmneu: any[] = []

  filteredMenuItems: any[] = [];
  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
  isSubMenuVisible: boolean = false;

  toggleCollapse() {
    this.isSubMenuVisible = !this.isSubMenuVisible;
  }
  toggleRoleCollapse() {
    this.isRolMenuVisible = !this.isRolMenuVisible;
  }

  toggleSocialCollapse() {
    this.isSocialMenuVisible = !this.isSocialMenuVisible;
  }
  ngOnInit(): void {

    this.service.getPermissionData().subscribe((permissions) => {
      if (permissions) {
        this.permissionData = permissions;
        this.filterMenuItemsByPermissions();
      }
    });


  }
  filterMenuItemsByPermissions() {
    this.filteredMenuItems = this.menuItems;
    this.permissionData = this.service.getPermission()
    console.log(this.permissionData)
    let findRole = this.service.getRole()
    console.log(findRole)
    this.findQuery = `${findRole[0]['role_key']}`
    console.log(this.findQuery)

    const moduleNames = Object.keys(this.permissionData[this.findQuery]);

    console.log(this.filteredMenuItems)
    // Filter menuItems based on module names
    this.filteredMenuItems = this.menuItems.filter(item => {
      const key: any = item.key;
      return moduleNames.includes(key);
    });
    console.log(this.filteredMenuItems)

    this.isReportModuleAvailable = this.checkReportModule('report');
    //this.isRoleModuleAvailable = this.checkRoleModule('role');
    this.rolefilterSubmenuItems = this.roleSubmenuItems.filter(submenuItem => {
      const key: any = submenuItem.key || submenuItem.route.split('/')[1]; // You may need to adjust this based on your key structure
      return moduleNames.includes(key);
    });
    this.reportFilterSubmneu = this.reportMenuItems.filter((submenuItem: any) => {
      const key: any = submenuItem.key || submenuItem.route.split('/')[1]; // You may need to adjust this based on your key structure
      return moduleNames.includes(key);
    });

    this.socialFilterSubmneu = this.socialMenuItems.filter((submenuItem: any) => {
      const key: any = submenuItem.key || submenuItem.route.split('/')[1]; // You may need to adjust this based on your key structure
      return moduleNames.includes(key);
    });


  }
  checkReportModule(key: any): boolean {
    return Object.keys(this.permissionData[this.findQuery]).some((item: any) => item === key);
  }

  checkRoleModule(key: any): boolean {
    return Object.keys(this.permissionData[this.findQuery]).some((item: any) => item === key);
  }
  getPermissions() {
    this.service.showSpinner()


    this.service.getApiWithAuth(`/admin/permissions`).subscribe({
      next: (success: any) => {
        if (success.status_code == 200) {
          this.service.hideSpinner()
          this.apiResponse = success.data
          this.service.setPermission(this.apiResponse)
        }

      },
      error: (error: any) => {
        console.log({ error })
      }
    })
  }

  getColor(iconName: string): string {
    switch (iconName) {
      case 'image':
        return '#0a53ff'; // blue color
      case 'sell':
        return '#ffbe0a'; // yellow color
      case 'forum':
        return '#d628d6'; // purple color
      case 'location_on':
        return '#9637f5'; // indigo color
      case 'receipt_long':
        return '#28e778'; // green color
      case 'event_seat':
        return '#e82c2b'; // red color
      case 'reviews':
        return '#248fd0'; // light blue color
      case 'campaign':
        return '#e6cf08'; // gold color
      case 'business_center':
        return '#f54d37'; // orange color
      case 'restaurant':
        return '#00bc5e'; // green color
      case 'auto_stories':
        return '#ff6b22'; // orange color
      case 'group':
        return '#1d599f'; // dark blue color
      case 'manufacturing':
        return '#8c1d9f'; // dark purple color
      case 'explore':
        return '#e620e9'; // mustard yellow color
      case 'notifications':
        return '#1eca2c'; // green color
      case 'build':
        return '#a539e4'; // violet color
      case 'person_pin':
        return '#1eca2c'; // violet color
      case 'folder_managed':
        return '#e43939'; // violet color
      case 'folder_supervised':
        return '#a539e4'; // violet color
      case 'manage_accounts':
        return '#f53737'; // violet color
      case 'shield_person':
        return '#1eca2c'; // violet color
      case 'stadia_controller':
        return '#f53737'; // bright red color
      case 'developer_guide':
        return '#1bdda3'; // turquoise color
      case 'Trophy':
        return '#4a37f5'; // deep blue color
      case 'military_tech':
        return '#f86a3e'; // bright orange color
      case 'backup':
        return '#ff0a0a'; // yellow color
      case 'phone_iphone':
        return '#a539e4'; // violet color
      case 'e43939':
        return '#e43939';
      case 'shopping_cart':
        return '#1eca2c'; // red color
      case 'category_search':
        return '#ffbe0a'; // yellow color
      case 'description':
        return '#f86a3e';
      case 'people':
        return '#f53737'; // red color
      default:
        return '#000000'; // default black color
    }
  }
  filterReportModule(key: any) {
    return Object.keys(this.permissionData[this.findQuery]).filter(item =>
      item.toLowerCase().includes(key)
    )
  }
  filterRoleModule(key: any) {
    return Object.keys(this.permissionData[this.findQuery]).filter(item =>
      item.toLowerCase().includes(key)
    )
  }
  async filterMenuItems() {
    // Step 1: Perform the search filter
    if (this.searchTerm.trim() !== '') {
      // Filter menuItems by label based on the search term
      this.filteredMenuItems = this.filteredMenuItems.filter(item =>
        item.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.rolefilterSubmenuItems = this.roleSubmenuItems.filter(item => item.label.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.reportFilterSubmneu = this.reportMenuItems.filter(item => item.label.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.socialFilterSubmneu = this.socialMenuItems.filter(item => item.label.toLowerCase().includes(this.searchTerm.toLowerCase()));
    
    } else {
      // If no search term is provided, show all menu items
      this.filteredMenuItems = this.menuItems;
      this.rolefilterSubmenuItems = this.roleSubmenuItems
      this.reportFilterSubmneu = this.reportMenuItems
      this.socialFilterSubmneu = this.socialMenuItems

      let findRole = this.service.getRole();
      this.findQuery = `${findRole[0]['role_key']}`;

      // Get the allowed module keys based on permissions
      const moduleNames = Object.keys(this.permissionData[this.findQuery]);

      // Step 3: Filter the menu items based on permissions
      this.filteredMenuItems = this.filteredMenuItems.filter(item => {
        const key: any = item.key;
        return moduleNames.includes(key);  // Only include menu items that are allowed by permissions
      });

      // Step 4: Special handling for role and report modules
      // Role and report should only appear if the search term explicitly matches "role" or "report"
      this.rolefilterSubmenuItems = this.roleSubmenuItems.filter(submenuItem => {
        const key: any = submenuItem.key || submenuItem.route.split('/')[1]; // You may need to adjust this based on your key structure
        return moduleNames.includes(key);
      });
      this.reportFilterSubmneu = this.reportMenuItems.filter((submenuItem: any) => {
        const key: any = submenuItem.key || submenuItem.route.split('/')[1]; // You may need to adjust this based on your key structure
        return moduleNames.includes(key);
      });
      this.socialFilterSubmneu = this.socialMenuItems.filter((submenuItem: any) => {
        const key: any = submenuItem.key || submenuItem.route.split('/')[1]; // You may need to adjust this based on your key structure
        return moduleNames.includes(key);
      });
    }

    // Step 2: Fetch the role and permissions for the user

    console.log(this.reportFilterSubmneu)



  }

  adminLogout() {
    const dialogRef = this.dialog.open(ConfirmLogoutComponent, {
      hasBackdrop: false,
      width: '40%',
      height: '30%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
