import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LocationManagementComponent } from './location-management/location-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { MerchantManagementComponent } from './merchant-management/merchant-management.component';
import { RestaurantManagementComponent } from './restaurant-management/restaurant-management.component';
import { ReservationManagementComponent } from './reservation-management/reservation-management.component';
import { BannerManagementComponent } from './banner-management/banner-management.component';
import { FeedbackManagementComponent } from './feedback-management/feedback-management.component';
import { AdminGuardService as AdminGuard } from 'src/guard/guard.service';
import { AmenitiesManagementComponent } from './amenities-management/amenities-management.component';
import { DinningManagementComponent } from './dinning-management/dinning-management.component';
import { NotificationManagementComponent } from './notification-management/notification-management.component';
import { BuildManagementComponent } from './build-management/build-management.component';
import { StoriesManagementComponent } from './stories-management/stories-management.component';
import { WinnerBreakupComponent } from './winner-breakup/winner-breakup.component';
import { TournamentManagementComponent } from './tournament-management/tournament-management.component';
import { TournamentRuleManagementComponent } from './tournament-rule-management/tournament-rule-management.component';
import { GameManagementComponent } from './game-management/game-management.component';
import { SettingManagementComponent } from './setting-management/setting-management.component';
import { DeleteUsersComponent } from './delete-users/delete-users.component';
import { TransactionManagementComponent } from './transaction-management/transaction-management.component';
import { DatePipe } from '@angular/common';
import { CouponManagementComponent } from './coupon-management/coupon-management.component';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CouponRedeemComponent } from './coupon-redeem/coupon-redeem.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { CampaignManagementComponent } from './campaign-management/campaign-management.component';
import { CampaignandnotificationManagementComponent } from './campaignandnotification-management/campaignandnotification-management.component';
import { DialogManagementComponent } from './dialog-management/dialog-management.component';
import { DealMngmtComponent } from './deal-mngmt/deal-mngmt.component';
import { DealCategoryManagementComponent } from './deal-category-management/deal-category-management.component';
import { AgentManagementComponent } from './agent-management/agent-management.component';
import { CampaignReportComponent } from './campaign-report/campaign-report.component';
import { ActiveCampaignComponent } from './active-campaign/active-campaign.component';
import { PartnershipTrackingComponent } from './partnership-tracking/partnership-tracking.component';
import { BookingDetailReportComponent } from './booking-detail-report/booking-detail-report.component';
import { DealHistoryComponent } from './deal-history/deal-history.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { ModuleMangementComponent } from './module-mangement/module-mangement.component';
import { PermissionComponent } from './permission/permission.component';
import { RolePermissionManagementComponent } from './role-permission-management/role-permission-management.component';
import { UserRoleMangementComponent } from './user-role-mangement/user-role-mangement.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { AssignRoleModulePermissionComponent } from './assign-role-module-permission/assign-role-module-permission.component';
import { InstantPaymentManagementComponent } from './instant-payment-management/instant-payment-management.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NoDataFoundComponent } from './no-data-found/no-data-found.component';
import { CashoutRequestManagementComponent } from './cashout-request-management/cashout-request-management.component';
import { WasteToEarnManagementComponent } from './waste-to-earn-management/waste-to-earn-management.component';
import { InfluncerManagementComponent } from './influncer-management/influncer-management.component';
import { ConvertHistoryListComponent } from './convert-history-list/convert-history-list.component';
import { PostManagementComponent } from './post-management/post-management.component';
import { SocialRestaurantManagementComponent } from './social-restaurant-management/social-restaurant-management.component';
import { SocialReportComponent } from './social-report/social-report.component';
import { CommentReportComponent } from './comment-report/comment-report.component';
import { UserSocialReportComponent } from './user-social-report/user-social-report.component';
import { WishlistReportComponent } from './wishlist-report/wishlist-report.component';
import { RatingReportComponent } from './rating-report/rating-report.component';
import { GiftGoodiesManagementComponent } from './gift-goodies-management/gift-goodies-management.component';
import { ViewGoodiesRedeemListComponent } from './dialog/view-goodies-redeem-list/view-goodies-redeem-list.component';
import { PriceListComponent } from './price-list/price-list.component';
import { CusinesListComponent } from './cusines-list/cusines-list.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'category/list', component: CategoryManagementComponent, canActivate: [AdminGuard] },
  { path: 'game/list', component: GameManagementComponent, canActivate: [AdminGuard] },
  { path: 'location/list', component: LocationManagementComponent, canActivate: [AdminGuard] },
  { path: 'side-nab', component: SidenavComponent, canActivate: [AdminGuard] },
  { path: 'user/list', component: UserManagementComponent, canActivate: [AdminGuard] },
  { path: 'merchant/list', component: MerchantManagementComponent, canActivate: [AdminGuard] },
  { path: 'restaurant/list', component: RestaurantManagementComponent, canActivate: [AdminGuard] },
  { path: 'booking/list', component: ReservationManagementComponent, canActivate: [AdminGuard] },
  { path: 'role/list', component: RoleManagementComponent, canActivate: [AdminGuard] },
  { path: 'module/list', component: ModuleMangementComponent, canActivate: [AdminGuard] },
  { path: 'role-permission/list', component: RolePermissionManagementComponent, canActivate: [AdminGuard] },
  { path: 'assign-role-permission/list', component: AssignRoleModulePermissionComponent, canActivate: [AdminGuard] },
  { path: 'permission/list', component: PermissionComponent, canActivate: [AdminGuard] },
  { path: 'user-role/list', component: UserRoleMangementComponent, canActivate: [AdminGuard] },
  { path: 'admin/list', component: AdminManagementComponent, canActivate: [AdminGuard] },
  {path: 'banner/list', component: BannerManagementComponent, canActivate: [AdminGuard]},
  { path: 'feedback/list', component: FeedbackManagementComponent, canActivate: [AdminGuard] },
  { path: 'amenities/list', component: AmenitiesManagementComponent, canActivate: [AdminGuard] },
  { path: 'dinning/list', component: DinningManagementComponent, canActivate: [AdminGuard] },
  { path: 'notification/list', component: NotificationManagementComponent, canActivate: [AdminGuard] },
  { path: 'build/list', component: BuildManagementComponent, canActivate: [AdminGuard] },
  { path: 'stories/list', component: StoriesManagementComponent, canActivate: [AdminGuard] },
  { path: 'coupon/list', component: CouponManagementComponent, canActivate: [AdminGuard] },
  { path: 'breakup/list', component: WinnerBreakupComponent, canActivate: [AdminGuard] },
  { path: 'tournament/list', component: TournamentManagementComponent, canActivate: [AdminGuard] },
  { path: 'tournament-rule/list', component: TournamentRuleManagementComponent, canActivate: [AdminGuard] },
  { path: 'app-setting/list', component: SettingManagementComponent, canActivate: [AdminGuard] },
  { path: 'deleted/users', component: DeleteUsersComponent, canActivate: [AdminGuard] },
  { path: 'transaction/list', component: TransactionManagementComponent, canActivate: [AdminGuard] },
  { path: 'notification-template/list', component: NotificationTemplateComponent, canActivate: [AdminGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'redeem/list', component: CouponRedeemComponent, canActivate: [AdminGuard] },
  { path: 'config', component: AppConfigComponent, canActivate: [AdminGuard] },
  { path: 'campaign/list', component: CampaignManagementComponent, canActivate: [AdminGuard] },
  // { path: 'campaign-notification/list', component: CampaignandnotificationManagementComponent, canActivate: [AdminGuard] },
  { path: 'dialog/list', component: DialogManagementComponent, canActivate: [AdminGuard] },
  { path: 'deal/list', component: DealMngmtComponent, canActivate: [AdminGuard] },
  { path: 'deal-category/list', component: DealCategoryManagementComponent, canActivate: [AdminGuard] },
  { path: 'agent/list', component: AgentManagementComponent, canActivate: [AdminGuard] },
  { path: 'influencer/list', component: InfluncerManagementComponent, canActivate: [AdminGuard] },
  { path: 'campaign/report', component: CampaignReportComponent, canActivate: [AdminGuard] },
  { path: 'active-campaign/report', component: ActiveCampaignComponent, canActivate: [AdminGuard] },
  { path: 'partnership-tracking/report', component: PartnershipTrackingComponent, canActivate: [AdminGuard] },
  { path: 'booking-details/report', component: BookingDetailReportComponent, canActivate: [AdminGuard] },
  { path: 'deal/history', component: DealHistoryComponent, canActivate: [AdminGuard] },
  { path: 'instant/payment', component: InstantPaymentManagementComponent, canActivate: [AdminGuard] },
  { path: 'change/password', component: ChangePasswordComponent, canActivate: [AdminGuard] },
  { path: 'home', component: NoDataFoundComponent, canActivate: [AdminGuard] },
  { path: 'cashout/request', component: CashoutRequestManagementComponent, canActivate: [AdminGuard] },
  { path: 'ways/earn', component: WasteToEarnManagementComponent, canActivate: [AdminGuard] },
  { path: 'convert/history', component: ConvertHistoryListComponent, canActivate: [AdminGuard] },
  { path: 'post/list', component: PostManagementComponent, canActivate: [AdminGuard] },
  { path: 'social-restaurant/list', component: SocialRestaurantManagementComponent, canActivate: [AdminGuard] },
  { path: 'price/list', component: PriceListComponent, canActivate: [AdminGuard] },
  { path: 'cuisines/list', component: CusinesListComponent, canActivate: [AdminGuard] },
  { path: 'social/report', component: SocialReportComponent, canActivate: [AdminGuard] },
  { path: 'comment/report', component: CommentReportComponent, canActivate: [AdminGuard] },
  { path: 'user/report', component: UserSocialReportComponent, canActivate: [AdminGuard] },
  { path: 'wishlist/report', component: WishlistReportComponent, canActivate: [AdminGuard] },
  { path: 'rating/report', component: RatingReportComponent, canActivate: [AdminGuard] },
  { path: 'gift-goodies/list', component: GiftGoodiesManagementComponent, canActivate: [AdminGuard] },
  { path: 'gift-goodies-redeem/list', component: ViewGoodiesRedeemListComponent, canActivate: [AdminGuard] },

];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class AppRoutingModule { }