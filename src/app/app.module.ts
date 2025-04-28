import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationManagementComponent } from './location-management/location-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InputBoxComponent } from './libraries/input-box/input-box.component';
import { PaginationComponent } from './libraries/pagination/pagination.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AddCategoryComponent } from './dialog/add-category/add-category.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddLocationComponent } from './dialog/add-location/add-location.component';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementComponent } from './user-management/user-management.component';
import { MerchantManagementComponent } from './merchant-management/merchant-management.component';
import { RestaurantManagementComponent } from './restaurant-management/restaurant-management.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { BannerManagementComponent } from './banner-management/banner-management.component';
import { ReservationManagementComponent } from './reservation-management/reservation-management.component';
import { FeedbackManagementComponent } from './feedback-management/feedback-management.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AddBannerComponent } from './dialog/add-banner/add-banner.component';
import { ConfirmRequestComponent } from './confirm-request/confirm-request.component';
import { ConfirmStatusComponent } from './dialog/confirm-status/confirm-status.component'; 
import {ConfirmRestaurantComponent } from './dialog/confirm-restaurant/confirm-restaurant.component'; 
import { MatMenuModule} from '@angular/material/menu';
import { DinningManagementComponent } from './dinning-management/dinning-management.component';
import { AmenitiesManagementComponent } from './amenities-management/amenities-management.component';
import { AddAmenitiesComponent } from './dialog/add-amenities/add-amenities.component';
import { AddDinningComponent } from './dialog/add-dinning/add-dinning.component';
import { ConfirmLogoutComponent } from './dialog/confirm-logout/confirm-logout.component';
import { ConfirmAutoBookingComponent } from './dialog/confirm-auto-booking/confirm-auto-booking.component';
import { NotificationManagementComponent } from './notification-management/notification-management.component';
import { SendNotificationComponent } from './dialog/send-notification/send-notification.component';
import { BuildManagementComponent } from './build-management/build-management.component';
// import { AddBuildComponent } from './dialog/add-build/add-build.component';
import { QuillModule } from 'ngx-quill'
import { AddBuildModule } from './dialog/add-build/add-build.module';
import { StoriesManagementComponent } from './stories-management/stories-management.component';
import { AddStoriesComponent } from './dialog/add-stories/add-stories.component';
import { DeleteRequestComponent } from './dialog/delete-request/delete-request.component';
import { WinnerBreakupComponent } from './winner-breakup/winner-breakup.component';
import { TournamentRuleManagementComponent } from './tournament-rule-management/tournament-rule-management.component';
import { ViewBreakupComponent } from './view-breakup/view-breakup.component';
import { AddBreakupComponent } from './add-breakup/add-breakup.component';
import { TournamentManagementComponent } from './tournament-management/tournament-management.component';
import { AddTournamentComponent } from './dialog/add-tournament/add-tournament.component';
import { MatRadioModule } from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { AddRuleComponent } from './dialog/add-rule/add-rule.component';
import { ViewRuleComponent } from './dialog/view-rule/view-rule.component';
import { GameManagementComponent } from './game-management/game-management.component';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ViewLeaderboardComponent } from './dialog/view-leaderboard/view-leaderboard.component';
import { SettingManagementComponent } from './setting-management/setting-management.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddSettingComponent } from './dialog/add-setting/add-setting.component';
import { ViewFeedbackDetailsComponent } from './dialog/view-feedback-details/view-feedback-details.component';
import { DeleteUsersComponent } from './delete-users/delete-users.component';
import { RestoreUserComponent } from './dialog/restore-user/restore-user.component';
import { ConfirmDeactivateComponent } from './dialog/confirm-deactivate/confirm-deactivate.component';
import { ConfirmDeactivateMessageComponent } from './dialog/confirm-deactivate-message/confirm-deactivate-message.component';
import { TransactionManagementComponent } from './transaction-management/transaction-management.component';
import { SlotListComponent } from './dialog/slot-list/slot-list.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BookingCancelComponent } from './dialog/booking-cancel/booking-cancel.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ForcePassUpdateComponent } from './dialog/force-pass-update/force-pass-update.component';
import { ImagePreviewDialogComponent } from './dialog/image-preview-dialog/image-preview-dialog.component';
import { SearchComponent } from './search/search.component';
import { TxnFiltersComponent } from './dialog/txn-filters/txn-filters.component';
import { HashTruncateDirective } from './hash-truncate.directive';
import { CusinePopupComponent } from './cusine-popup/cusine-popup.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';
import { CouponManagementComponent } from './coupon-management/coupon-management.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import { DeleteCouponComponent } from './dialog/delete-coupon/delete-coupon.component';
import { ConfirmPilotModeComponent } from './dialog/confirm-pilot-mode/confirm-pilot-mode.component';
import { ConfirmRestaurantPilotModeComponent } from './dialog/confirm-restaurant-pilot-mode/confirm-restaurant-pilot-mode.component';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import { AddNotificationTemplateComponent } from './add-notification-template/add-notification-template.component';
import { RejectReservationComponent } from './reject-reservation/reject-reservation.component';
import { ConfirmationPoupupComponent } from './confirmation-poupup/confirmation-poupup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewTopRestroComponent } from './dialog/view-top-restro/view-top-restro.component';
import { ViewDatesComponent } from './dialog/view-dates/view-dates.component';
import { CouponRedeemComponent } from './coupon-redeem/coupon-redeem.component';
import { AddRedeemComponent } from './dialog/add-redeem/add-redeem.component';
import { DeleteRedeemComponent } from './dialog/delete-redeem/delete-redeem.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { UserFilterComponent } from './dialog/user-filter/user-filter.component';
import { CampaignManagementComponent } from './campaign-management/campaign-management.component';
import { AddCampaignComponent } from './dialog/add-campaign/add-campaign.component';
import { DeleteCampaignComponent } from './dialog/delete-campaign/delete-campaign.component';
import { AddRemoveNukhbaUserComponent } from './dialog/add-remove-nukhba-user/add-remove-nukhba-user.component';
import { ViewFcmTokenComponent } from './dialog/view-fcm-token/view-fcm-token.component';
import { AddUserEmailComponent } from './dialog/add-user-email/add-user-email.component';
import { ViewRestroBookingsComponent } from './dialog/view-restro-bookings/view-restro-bookings.component';
import { ReservationFilterComponent } from './dialog/reservation-filter/reservation-filter.component';
import { ViewUsersDetailsComponent } from './dialog/view-users-details/view-users-details.component';
import { ViewRestaurantDetailsComponent } from './dialog/view-restaurant-details/view-restaurant-details.component';
import { CampaignandnotificationManagementComponent } from './campaignandnotification-management/campaignandnotification-management.component';
import { NotiFilterComponent } from './dialog/noti-filter/noti-filter.component';
import { CreateDialogComponent } from './dialog/create-dialog/create-dialog.component';
import { DialogManagementComponent } from './dialog-management/dialog-management.component';
import { DeleteDialogComponent } from './dialog/delete-dialog/delete-dialog.component';
import { ViewPaxDetailsComponent } from './dialog/view-pax-details/view-pax-details.component';
import { AddDealComponent } from './dialog/add-deal/add-deal.component';
import { DealMngmtComponent } from './deal-mngmt/deal-mngmt.component';
import { DealCategoryManagementComponent } from './deal-category-management/deal-category-management.component';
import { AddDealCategoryComponent } from './dialog/add-deal-category/add-deal-category.component';
import { ViewUserDealComponent } from './dialog/view-user-deal/view-user-deal.component';
import { DealFiltersComponent } from './dialog/deal-filters/deal-filters.component';
import { AgentManagementComponent } from './agent-management/agent-management.component';
import { AddAgentComponent } from './dialog/add-agent/add-agent.component';
import { GmtPipe } from './gmt.pipe';
import { CampaignReportComponent } from './campaign-report/campaign-report.component';
import { ActiveCampaignComponent } from './active-campaign/active-campaign.component';
import { PartnershipTrackingComponent } from './partnership-tracking/partnership-tracking.component';
import { BookingDetailReportComponent } from './booking-detail-report/booking-detail-report.component';
import { DeleteDealComponent } from './delete-deal/delete-deal.component';
import { SortPipe } from './sort.pipe';
import { DatTimePickerComponent } from './common/date-time-picker/date-time-picker.component';
import { DealHistoryComponent } from './deal-history/deal-history.component';
import { DealHistoryFilterComponent } from './dialog/deal-history-filter/deal-history-filter.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RoleManagementComponent } from './role-management/role-management.component';
import { ModuleMangementComponent } from './module-mangement/module-mangement.component';
import { AddRoleComponent } from './dialog/add-role/add-role.component';
import { AddModuleComponent } from './dialog/add-module/add-module.component';
import { PermissionComponent } from './permission/permission.component';
import { AddPermissionComponent } from './dialog/add-permission/add-permission.component';
import { RolePermissionManagementComponent } from './role-permission-management/role-permission-management.component';
import { AddRolePermissionComponent } from './dialog/add-role-permission/add-role-permission.component';
import { AdminRegisterComponent } from './dialog/admin-register/admin-register.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { UserRoleMangementComponent } from './user-role-mangement/user-role-mangement.component';
import { AddUserRoleManagementComponent } from './dialog/add-user-role-management/add-user-role-management.component';
import { AssignRoleModulePermissionComponent } from './assign-role-module-permission/assign-role-module-permission.component';
import { TitlecasePipe } from './titlecase.pipe';
import { InstantPaymentManagementComponent } from './instant-payment-management/instant-payment-management.component';
import { InstantPaymentFilterComponent } from './dialog/instant-payment-filter/instant-payment-filter.component';
import { AddInstantPaymentComponent } from './dialog/add-instant-payment/add-instant-payment.component';
import { DealOptionUpdateComponent } from './dialog/deal-option-update/deal-option-update.component';
import { AddSlotTemplateComponent } from './dialog/add-slot-template/add-slot-template.component';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewUserDetailsComponent } from './dialog/view-user-details/view-user-details.component';
import { ViewTxnDetailsComponent } from './dialog/view-txn-details/view-txn-details.component';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NoDataFoundComponent } from './no-data-found/no-data-found.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PreSelectRestroComponent } from './dialog/pre-select-restro/pre-select-restro.component';
import { DealEnableDisableComponent } from './dialog/deal-enable-disable/deal-enable-disable.component';
import { CashoutRequestManagementComponent } from './cashout-request-management/cashout-request-management.component';
import { UpdateCashoutRequestComponent } from './dialog/update-cashout-request/update-cashout-request.component';
import { WasteToEarnManagementComponent } from './waste-to-earn-management/waste-to-earn-management.component';
import { EditWasteToEarnComponent } from './dialog/edit-waste-to-earn/edit-waste-to-earn.component';
import { InfluncerManagementComponent } from './influncer-management/influncer-management.component';
import { ConfirmInfluncerRequestComponent } from './dialog/confirm-influncer-request/confirm-influncer-request.component';
import { AddRemarkInfluncerComponent } from './add-remark-influncer/add-remark-influncer.component';
import { UpdateCommissionComponent } from './update-commission/update-commission.component';
import { ConvertHistoryListComponent } from './convert-history-list/convert-history-list.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ViewImageUrlComponent } from './dialog/view-image-url/view-image-url.component';
import { AddMediaComponent } from './dialog/add-media/add-media.component';
import { DealEnableCreditsComponent } from './dialog/deal-enable-credits/deal-enable-credits.component';
import { FavoriteDishesComponent } from './dialog/favorite-dishes/favorite-dishes.component';
import { PostManagementComponent } from './post-management/post-management.component';
import { ViewPostDetailsComponent } from './dialog/view-post-details/view-post-details.component';
import { ViewLikeListComponent } from './dialog/view-like-list/view-like-list.component';
import { ViewCommentListComponent } from './dialog/view-comment-list/view-comment-list.component';
import { SocialRestaurantManagementComponent } from './social-restaurant-management/social-restaurant-management.component';
import { ViewSuggestedCuisinesComponent } from './dialog/view-suggested-cuisines/view-suggested-cuisines.component';
import { ViewSuggestedPriceComponent } from './dialog/view-suggested-price/view-suggested-price.component';
import { SocialReportComponent } from './social-report/social-report.component';
import { CommentReportComponent } from './comment-report/comment-report.component';
import { RatingReportComponent } from './rating-report/rating-report.component';
import { WishlistReportComponent } from './wishlist-report/wishlist-report.component';
import { UserSocialReportComponent } from './user-social-report/user-social-report.component';
import { ViewReportedUserDetailsComponent } from './dialog/view-reported-user-details/view-reported-user-details.component';
import { ViewReportRestaurantDetailsComponent } from './dialog/view-report-restaurant-details/view-report-restaurant-details.component';
import { ConfirmReportStatusComponent } from './dialog/confirm-report-status/confirm-report-status.component';
import { GiftGoodiesManagementComponent } from './gift-goodies-management/gift-goodies-management.component';
import { AddGiftGoodiesComponent } from './dialog/add-gift-goodies/add-gift-goodies.component';
import { DeleteGiftsComponent } from './dialog/delete-gifts/delete-gifts.component';
import { ViewGoodiesRedeemListComponent } from './dialog/view-goodies-redeem-list/view-goodies-redeem-list.component';
import { UpdateStatusRedeemListComponent } from './dialog/update-status-redeem-list/update-status-redeem-list.component';
import { UpdateSuggestedPriceComponent } from './dialog/update-suggested-price/update-suggested-price.component';
import { ViewCoinHistoryComponent } from './dialog/view-coin-history/view-coin-history.component';
import { PriceListComponent } from './price-list/price-list.component';
import { CusinesListComponent } from './cusines-list/cusines-list.component';
import { PostFilterComponent } from './dialog/post-filter/post-filter.component';
import { RedeemOtpComponent } from './dialog/redeem-otp/redeem-otp.component';
import { UpdateFoodieLeaderboardComponent } from './dialog/update-foodie-leaderboard/update-foodie-leaderboard.component';
// Add this constant to customize the date-time format (optional)
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LocationManagementComponent,
    CategoryManagementComponent,
    InputBoxComponent,
    PaginationComponent,
    AddCategoryComponent,
    SidenavComponent,
    AddLocationComponent,
    UserManagementComponent,
    MerchantManagementComponent,
    RestaurantManagementComponent,
    BannerManagementComponent,
    ReservationManagementComponent,
    FeedbackManagementComponent,
    AddBannerComponent,
    AddMediaComponent,
    ConfirmRequestComponent,
    ConfirmStatusComponent,
    ConfirmRestaurantComponent,
    DinningManagementComponent,
    AmenitiesManagementComponent,
    AddAmenitiesComponent,
    AddDinningComponent,
    ConfirmLogoutComponent,
    ConfirmAutoBookingComponent,
    NotificationManagementComponent,
    SendNotificationComponent,
    BuildManagementComponent,
    StoriesManagementComponent,
    AddStoriesComponent,
    DeleteRequestComponent,
    WinnerBreakupComponent,
    TournamentRuleManagementComponent,
    ViewBreakupComponent,
    AddBreakupComponent,
    TournamentManagementComponent,
    AddTournamentComponent,
    AddRuleComponent,
    ViewRuleComponent,
    GameManagementComponent,
    ViewLeaderboardComponent,
    SettingManagementComponent,
    AddSettingComponent,
    ViewFeedbackDetailsComponent,
    DeleteUsersComponent,
    RestoreUserComponent,
    ConfirmDeactivateComponent,
    ConfirmDeactivateMessageComponent,
    TransactionManagementComponent,
    SlotListComponent,
    BookingCancelComponent,
    ForcePassUpdateComponent,
    ImagePreviewDialogComponent,
    SearchComponent,
    TxnFiltersComponent,
    HashTruncateDirective,
    CusinePopupComponent,
    ViewBookingComponent,
    CouponManagementComponent,
    AddCouponComponent,
    DeleteCouponComponent,
    ConfirmPilotModeComponent,
    ConfirmRestaurantPilotModeComponent,
    NotificationTemplateComponent,
    AddNotificationTemplateComponent,
    RejectReservationComponent,
    ConfirmationPoupupComponent,
    DashboardComponent,
    ViewTopRestroComponent,
    ViewDatesComponent,
    CouponRedeemComponent,
    AddRedeemComponent,
    DeleteRedeemComponent,
    AppConfigComponent,
    UserFilterComponent,
    CampaignManagementComponent,
    AddCampaignComponent,
    DeleteCampaignComponent,
    AddRemoveNukhbaUserComponent,
    ViewFcmTokenComponent,
    AddUserEmailComponent,
    ViewRestroBookingsComponent,
    ReservationFilterComponent,
    ViewUsersDetailsComponent,
    ViewRestaurantDetailsComponent,
    CampaignandnotificationManagementComponent,
    NotiFilterComponent,
    CreateDialogComponent,
    DialogManagementComponent,
    DeleteDialogComponent,
    ViewPaxDetailsComponent,
    AddDealComponent,
    DealMngmtComponent,
    DealCategoryManagementComponent,
    AddDealCategoryComponent,
    ViewUserDealComponent,
    DealFiltersComponent,
    AgentManagementComponent,
    AddAgentComponent,
    GmtPipe,
    CampaignReportComponent,
    ActiveCampaignComponent,
    PartnershipTrackingComponent,
    BookingDetailReportComponent,
    DeleteDealComponent,
    SortPipe,
    DatTimePickerComponent,
    DealHistoryComponent,
    DealHistoryFilterComponent,
    RoleManagementComponent,
    ModuleMangementComponent,
    AddRoleComponent,
    AddModuleComponent,
    PermissionComponent,
    AddPermissionComponent,
    RolePermissionManagementComponent,
    AddRolePermissionComponent,
    AdminRegisterComponent,
    AdminManagementComponent,
    UserRoleMangementComponent,
    AddUserRoleManagementComponent,
    AssignRoleModulePermissionComponent,
    TitlecasePipe,
    InstantPaymentManagementComponent,
    InstantPaymentFilterComponent,
    AddInstantPaymentComponent,
    DealOptionUpdateComponent,
    AddSlotTemplateComponent,
    AddSlotTemplateComponent,
    ViewUserDetailsComponent,
    ViewTxnDetailsComponent,
    ChangePasswordComponent,
    NoDataFoundComponent,
    PreSelectRestroComponent,
    DealEnableDisableComponent,
    CashoutRequestManagementComponent,
    UpdateCashoutRequestComponent,
    WasteToEarnManagementComponent,
    EditWasteToEarnComponent,
    InfluncerManagementComponent,
    ConfirmInfluncerRequestComponent,
    AddRemarkInfluncerComponent,
    UpdateCommissionComponent,
    ConvertHistoryListComponent,
    ImageUploadComponent,
    ViewImageUrlComponent,
    AddMediaComponent,
    DealEnableCreditsComponent,
    PostManagementComponent,
    ViewPostDetailsComponent,
    ViewLikeListComponent,
    ViewCommentListComponent,
    SocialRestaurantManagementComponent,
    ViewSuggestedCuisinesComponent,
    ViewSuggestedPriceComponent,
    FavoriteDishesComponent,
    ViewPostDetailsComponent,
    SocialReportComponent,
    CommentReportComponent,
    RatingReportComponent,
    WishlistReportComponent,
    UserSocialReportComponent,
    ViewReportedUserDetailsComponent,
    ViewReportRestaurantDetailsComponent,
    ConfirmReportStatusComponent,
    GiftGoodiesManagementComponent,
    AddGiftGoodiesComponent,
    DeleteGiftsComponent,
    ViewGoodiesRedeemListComponent,
    UpdateStatusRedeemListComponent,
    UpdateSuggestedPriceComponent,
    ViewCoinHistoryComponent,
    PriceListComponent,
    CusinesListComponent,
    PostFilterComponent,
    RedeemOtpComponent,
    UpdateFoodieLeaderboardComponent
  ],
  imports: [
    BrowserModule,
    MatChipsModule,
    DragDropModule,
    MatCheckboxModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule, ReactiveFormsModule,
    MatCardModule,
    ToastrModule.forRoot(),
    FlexLayoutModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    NgxMatSelectSearchModule,
    MatSlideToggleModule,
    QuillModule.forRoot({
     
  }),
    AddBuildModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatProgressBarModule
  ],
  providers: [MatDatepickerModule,  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
