import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { AppService } from 'src/app.service';
import { TournamentManagementComponent } from 'src/app/tournament-management/tournament-management.component';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { AddMediaComponent } from '../add-media/add-media.component';

@Component({
  selector: 'app-add-deal',
  templateUrl: './add-deal.component.html',
  styleUrls: ['./add-deal.component.scss']
})
export class AddDealComponent {
  today = new Date();
  dateFilter = (date: Date | null): boolean => {
    const currentDate = new Date();
    // Set time to 0 to only compare dates without time
    currentDate.setHours(0, 0, 0, 0);
    return date ? date >= currentDate : false;
  }
  categoryData: any
  showAllCategories = false;
  newDeal!: FormGroup;
  submitted: boolean = false;
  formInvalid: boolean = false;
  selectedDeal: any = {};
  imageURL: any = [];
  uncheckedItems: any = []
  thumbnailUrl: string = "";
  image: string = "";
  resData: any;
  breakupData: any;
  ruleData: any;
  tournamentImage: any[] = [];
  entity_id: any;
  notCheckedData: any = []
  mediaIds: any[] = [];
  imageSize: any = 0;
  dealDataV2: any;
  images: any
  branchdata: any
  isDisabled: any
  showAll = true
  options: string[] = [];
  filterControl = new FormControl();
  selectControl = new FormControl();
  filteredOptions: Observable<string[]> | undefined;
  campaignData: any;
  homeImageUrl: any
  categoryArr: any = [];
  isRemove: boolean = false
  startTime: any = [];
  endTime: any = [];
  oldDate: any
  imageData: any = [];
  imageDataHome: any = ""
  constructor(
    private route: Router,
    public _appService: AppService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TournamentManagementComponent>
  ) {
    this.newDeal = this.fb.group({
      id: [''],
      res_id: [''],
      title: [''],
      start_time: [''],
      end_time: [''],
      image: [''],
      description: [''],
      options: this.fb.array([]),
      days_validity: [null],
      deal_highlights: [''],
      deal_conditions: [''],
      campaign_id: [''],
      template: ['Normal'],
      // Default value null
      slots: this.fb.array([this.createTimeSlot()]),  // Array of start_time and end_time
      days: this.fb.array(this.weekDays.map(() => this.fb.control(false))),
      exclude_dates: [""],
      // otherBranchRedeemption: [''],
      permitted_restaurant_ids: [''],
      type: [''],
      is_pilot: [''],
      device_check: ['0'],
      is_locked: ['0'],
      sold_out: ['0'],
      referral: [],
      referral_mobile_verified: [],
      deal_categories: [''],
      free_with_nukhba_credits: ['']
    });
    this.newDeal.get('template')?.valueChanges.subscribe((templateValue) => {
      const slotsArray = this.newDeal.get('slots') as FormArray;
      if (templateValue === 'Slot') {
        slotsArray.controls.forEach(slot => {
          slot.get('start_at')?.setValidators([Validators.required]);
          slot.get('end_at')?.setValidators([Validators.required]);
        });
      } else {
        slotsArray.controls.forEach(slot => {
          slot.get('start_at')?.clearValidators();
          slot.get('end_at')?.clearValidators();
        });
      }

      // Recalculate validation for each control
      slotsArray.controls.forEach(slot => {
        slot.get('start_at')?.updateValueAndValidity();
        slot.get('end_at')?.updateValueAndValidity();
      });
    });

    this.createDefaultSlotBreakup('00:00', '23:59')
    this.daysFormArray = this.newDeal.get('days') as FormArray;
  }
  daysFormArray: FormArray;
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  createDaysFormArray(): FormArray {
    const controls = this.weekDays.map(day => new FormControl(false)); // Initialize all checkboxes as unchecked
    return new FormArray(controls);
  }

  getDayControl(index: number): FormControl {
    return this.daysFormArray.at(index) as FormControl;
  }
  datesData: any = []
  selectedDateChips: any[] = []
  addDates(data: any) {
    let date = this.convertIntoDate(data.target.value.toISOString())
    let dateFormat = date.slice(0, 10)
    //this.datesData.push(dateFormat)
    this.selectedDateChips.push(dateFormat);

  }
  removeChip(chip: string) {

    this.selectedDateChips = this.selectedDateChips.filter((c: any) => c !== chip);
    //this.datesData = this.datesData.filter((c: any) => c !== chip);

  }
  getSelectedDays(): string[] {
    const selectedDays: string[] = [];
    this.daysFormArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedDays.push(this.weekDays[index].toLowerCase());
      }
    });
    return selectedDays;
  }
  convertIntoDate(originalDateString: any) {
    // Original date string
    // Parse the original date string into a Date object
    // Get the parts (year, month, day, hours, minutes, seconds) from the parsed date
    // Get the parts (year, month, day, hours, minutes) from the parsed date
    const originalDate = new Date(originalDateString);
    originalDate.setDate(originalDate.getDate());
    const dateOptions: any = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateString = originalDate.toLocaleString('en-US', dateOptions);
    const [month, day, year] = dateString.split('/');
    const formattedDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDateString
  }

  createTimeSlot(): FormGroup {
    return this.fb.group({
      start_at: [''],  // Default empty string
      end_at: [''],
      interval_in_mins: [null],     // Default empty string
    });
  }
  get timeSlots(): FormArray {
    return this.newDeal.get('slots') as FormArray;
  }
  createDefaultSlotBreakup(startTime: any, endTime: any) {
    let currentDateTime = DateTime.fromObject({
      hour: parseInt(startTime.split(':')[0], 10),
      minute: parseInt(startTime.split(':')[1], 10),
    });
    const endDateTime = DateTime.fromObject({
      hour: parseInt(endTime.split(':')[0], 10),
      minute: parseInt(endTime.split(':')[1], 10),
    });
    while (currentDateTime < endDateTime) {
      const currentEndTime = currentDateTime.plus({ minutes: 30 });
      let startData = {
        time: currentDateTime.toFormat('HH:mm'),
        value: currentDateTime.toFormat('h:mm a')
      }
      let endData = {
        time: currentEndTime.toFormat('HH:mm'),
        value: currentEndTime.toFormat('h:mm a')
      }
      this.startTime.push(startData)
      this.endTime.push(endData)
      // Create 12 time slots with 30-minute increments
      currentDateTime = currentEndTime;
    }

  }
  // Method to add a new time slot
  addTimeSlot() {
    this.timeSlots.push(this.createTimeSlot());
  }

  // Method to remove a time slot
  removeTimeSlot(index: number) {
    this.timeSlots.removeAt(index);
  }
  onInputChange(event: Event, key_name: any): void {
    const input = event.target as HTMLInputElement;
    // Replace any character that is not a letter or space with an empty string
    input.value = input.value.replace(/[^a-zA-Z ]/g, '');
    // Update the form control value
    this.newDeal.setValue({ key_name: input.value });
  }
  @ViewChild('datetimePicker') datetimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('dateEndtimePicker') dateEndtimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.datetimePicker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.dateEndtimePicker?.open());
  }

  ngOnInit(): void {
    this.getRestaurantList();
    this.getCampaignList()
    this.getCategoryList();
    this.datesData = this.data?.dealData.exclude_dates
    this.selectedDeal = this.data?.dealData;
    this.oldDate = this.data?.dealData?.exclude_dates
    this.entity_id = this.data.dealData.id
    setTimeout(() => {
      this.filteredOptions = this.filterControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }, 1000);
    if (this.data.dealData.id) {
      this.setFormvalues();
      this.getDealList(this.selectedDeal.id);
      // setTimeout(() => {
      // }, 3000);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  get option() {
    return this.newDeal.controls['options'] as FormArray;
  }

  dateEndFilter = (date: Date | null): boolean => {
    if (this.newDeal.value.start_time) {
      const currentDate = new Date(this.newDeal.value.start_time);
      // currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
      return date ? date >= currentDate : false;
    } else {
      const currentDate = new Date();
      // Set time to 0 to only compare dates without time
      currentDate.setHours(0, 0, 0, 0);
      return date ? date >= currentDate : false;
    }
  }

  removeOption(winningIndex: number, id: any) {
    if (id?.value?.deal_option_id) {
      let sendBody = { "deal_option_id": id.value.deal_option_id };
      this._appService.deleteApi(`/admin/deal/delete-option`, sendBody, 1).subscribe({
        next: (success: any) => {
          if (success.success) {
            this._appService.success(success.msg);
          }
        },
        error: (error: any) => {
          this._appService.err(error?.error?.msg);
        }
      });
    }
    const control = <FormArray>this.newDeal.get('options');
    control.removeAt(winningIndex);
  }

  closeDialogBox() {
    this.dialogRef.close({ 'status': 'close' });
  }

  changeType(data: any) {
    if (this.newDeal.value.type == 'free' && this.newDeal.value.options.length == 0) {
      this.addOption()
    }
    if (this.newDeal.value.type == 'free' && this.newDeal.value.options.length > 1) {
      for (let index = 0; index <= this.newDeal.value.options.length; index++) {
        this.removeOption(index, '')
      }
    }
    if (this.newDeal.value.options.length == 0 && this.newDeal.value.type != 'free') {
      this.addOption()
    }
  }

  getChangedValues(form: FormGroup): any {
    const changedValues: any = {};
    try {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control?.dirty) {
          changedValues[key] = control.value;
        }
      });
      return changedValues;
    } catch (error) {
      // console.log(error);

    }

  }

  arraysEqual(arr1: any = [], arr2: any = []): any {
    if ((arr1.length || arr2?.length)) {
      if (arr1?.length !== arr2?.length) {
        return false;
      }
      for (let i = 0; i < arr1?.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    } else {
      return true
    }

  }

  removeImagesArr: any = []

  removeImage(index: number, element: any) {
    if (!this.newDeal.value.id) {
      this.imageSize -= this.tournamentImage[index].size;
    } else {
      this.removeImagesArr?.push(this.selectedDeal.image_arr.find((image: any) => image.url === element).uid)
    }
    this.tournamentImage.splice(index, 1);
    this.imageURL.splice(index, 1);
  }

  removeHomeImagesArr: any = []

  removeHomeImage(element: any) {
    console.log(element)
    if (!this.newDeal.value.id) {
      this.imageSize -= this.images.size;
    } else {
      this.removeHomeImagesArr?.push(this.selectedDeal.image_arr.find((image: any) => image.url === element))
    }
    this.isRemove = true
    this.image = ''
    this.images = '';
  }

  uploadHomeImage() {
    if (this.images) {
      let formData = new FormData();
      formData.append('file', this.images);
      return new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next: (success: any) => {
            if (success.success) {
              this.homeImageUrl = success.data.media_id
              resolve(success.data.media_id);
            } else {
              reject(new Error('Upload failed'));
            }
          },
          error: (error: any) => {
            this._appService.err(error?.error?.msg);
            reject(error);
          }
        });
      });
    }
    else {
      return Promise.resolve(null);
    }
  }

  uploadImage() {
    if (this.tournamentImage.length > 0) {
      let uploadPromises = this.tournamentImage.map(file => {
        let formData = new FormData();
        formData.append('file', file);
        return new Promise((resolve, reject) => {
          this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
            next: (success: any) => {
              if (success.success) {
                resolve(success.data.media_id);
              } else {
                reject(new Error('Upload failed'));
              }
            },
            error: (error: any) => {
              this._appService.err(error?.error?.msg);
              reject(error);
            }
          });
        });
      });
      return Promise.all(uploadPromises);
    }
    else {
      return Promise.resolve([]);
    }
  }

  removeImageFromDatabase(formData: any) {
    // console.log("bhn")
    this._appService.putApiWithAuth(`/admin/deal/remove-images`, formData, 1).subscribe({
      next: (success: any) => {
        if (success.success) {
          this._appService.success(success.msg);

        } else {
          this._appService.success(success.msg);
        }
      },
      error: (error: any) => {
        this._appService.err(error?.error?.msg);

      }
    });
  }

  renameKey(obj: any, oldKey: string, newKey: string): any {
    if (oldKey !== newKey && obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  }
  onTemplateChange(event: any): void {

  }

  getChangedValuesWithIgnoredKeys(
    originalArray: any[],
    updatedArray: any[],
    keysToIgnore: string[]
  ) {
    // console.log(originalArray)
    // console.log(updatedArray)
    return updatedArray.filter(updatedItem => {
      const originalItem = originalArray.find(item => item.id === updatedItem.deal_option_id);
      return originalItem && !this.isEqualIgnoringKeys(originalItem, updatedItem, keysToIgnore);
    }).map(updatedItem => {
      const originalItem = originalArray.find(item => item.id === updatedItem.deal_option_id);
      const changes = Object.keys(updatedItem).reduce((result, key) => {
        if (!keysToIgnore.includes(key) && originalItem[key] != updatedItem[key]) {
          result[key] = updatedItem[key];
        }
        return result;
      }, {} as any);

      keysToIgnore.forEach(key => {
        if (updatedItem[key] !== undefined) {
          changes[key] = updatedItem[key];
        }
      });
      if (updatedItem.pax_details) {
        // Check if pax_details have changed
        const originalPaxDetails = originalItem.pax_details || {};
        const updatedPaxDetails = updatedItem.pax_details;

        if (JSON.stringify(originalPaxDetails) !== JSON.stringify(updatedPaxDetails)) {
          changes.pax_details = updatedPaxDetails;
          changes.pax_comission_type = updatedItem.pax_comission_type;
          changes.discounted_price = updatedItem.discounted_price
        } else {
          delete changes.pax_details
        }
      }

      changes.deal_option_id = updatedItem.deal_option_id;
      return changes;
    });
  }

  isEqualIgnoringKeys(obj1: any, obj2: any, keysToIgnore: string[]) {
    const filteredObj1 = this.filterKeys(obj1, keysToIgnore);
    const filteredObj2 = this.filterKeys(obj2, keysToIgnore);
    return JSON.stringify(filteredObj1) === JSON.stringify(filteredObj2);
  }

  banSigns(event: KeyboardEvent) {
    const invalidChars = ['-', '+'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  filterKeys(obj: any, keysToIgnore: string[]) {
    return Object.keys(obj).reduce((result: any, key) => {
      if (!keysToIgnore.includes(key)) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  }
  private processOptions(options: any[]): any[] {
    return options.map(option => {
      const processedOption = {
        ...option,
        pax_details: this.filterEmptyPaxDetails(option.pax_details),
      };
      return processedOption;
    });
  }
  private filterEmptyPaxDetails(paxDetails: any): any {
    // Remove keys with empty values
    const filteredPaxDetails = { ...paxDetails };

    Object.keys(filteredPaxDetails).forEach((key: any) => {
      // console.log(key)
      if (filteredPaxDetails[key] === "" || filteredPaxDetails[key] === null || (Array.isArray(filteredPaxDetails[key]) && filteredPaxDetails[key].length === 0)) {
        delete filteredPaxDetails[key];
      }
    });
    // console.log(filteredPaxDetails)
    return filteredPaxDetails;
  }

  private detectDifferences(prev: any[], current: any[]): any {
    return current.filter((item, index) => item !== prev[index]);
  }

  filterNestedObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj; // Return if not an object
    }
    const filtered = Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => [key, this.filterNestedObject(value)]) // Recursively filter nested objects
        .filter(([_, value]) =>
          value != null && value !== '' &&
          !(typeof value === 'object' && Object.keys(value).length === 0) // Remove empty objects
        )
    );
    return filtered;
  }

  // Function to process an array of objects
  filterArrayOfObjects(array: any[]): any[] {
    return array
      .map(obj => this.filterNestedObject(obj)) // Apply recursive filter to each object
      .filter(obj => Object.keys(obj).length > 0); // Remove empty objects
  }


  saveDeal = async () => {


    this._appService.updateLoading(true);
    try {
      console.log(this.imageDataHome)
      let imageBannerIds = this.imageData.length > 0 ? this.imageData?.map((item: any) => item.id) : [];
      let homeImage = this.imageDataHome.id;
      console.log(homeImage)
      if (this.selectedDeal.id && this.selectedDeal.image_arr.length > 0) {
       // imageBannerIds = imageBannerIds?.concat(this.selectedDeal.image_arr.map((image: any) => image.uid));
        if(imageBannerIds.length>0){
          imageBannerIds = imageBannerIds?.reduce((unique: any[], id: any) => {
            if (!unique.includes(id)) {
              unique.push(id); // Add to the array only if it's not already there
            }
            return unique;
          }, []);
        }

      }
      if (this.removeImagesArr.length > 0) {
        imageBannerIds = imageBannerIds.filter((id: any) => !this.removeImagesArr.includes(id));
      }
      console.log(homeImage)
      let resId = this.resData.filter((option: { name: any; }) => option.name == this.newDeal.value.res_id);
      let data: any = {
        restaurant_id: resId[0].id,
        title: this.newDeal.value.title,
        start_time: this.newDeal.value.start_time ? this.newDeal.value.start_time : '',
        end_time: this.newDeal.value.end_time ? this.newDeal.value.end_time : '',
        description: this.newDeal.value.description,
        deal_option: this.processOptions(this.newDeal.value.options),
        deal_highlights: this.newDeal.value.deal_highlights,
        deal_conditions: this.newDeal.value.deal_conditions,
        type: this.newDeal.value.type,
        campaign_id: this.newDeal.value.campaign_id,
        is_pilot: this.newDeal.value.is_pilot,
        device_check: Number(this.newDeal.value.device_check),
        is_locked: Number(this.newDeal.value.is_locked),
        free_with_nukhba_credits: Number(this.newDeal.value.free_with_nukhba_credits),
        // sold_out: Number(this.newDeal.value.sold_out),
        slots: this.newDeal.value.slots,
        days: this.getSelectedDays(),
        exclude_dates: this.selectedDateChips,
        template: this.newDeal.value.template == 'Normal' ? 0 : 1,
        deal_categories: this.categoryArr,
      };

      if (this.newDeal.value.is_locked == 1) {
        Object.assign(data, {
          lock_conditions: {
            referral: Number(this.newDeal.value.referral),
            referral_mobile_verified: Number(this.newDeal.value.referral_mobile_verified)
          },
        });
      }
      if (this.newDeal.value.permitted_restaurant_ids) {
        Object.assign(data, { 'permitted_restaurant_ids': this.newDeal.value.permitted_restaurant_ids });
      }

      if (this.newDeal.value.days_validity) {
        Object.assign(data, { 'days_validity': this.newDeal.value.days_validity });
      }
      if (imageBannerIds.length > 0) {
        data.images = imageBannerIds;
      }
      if (homeImage != null) {
        data.home_image = homeImage
      } else {
        data.home_image = this.selectedDeal?.home_image?.uid
      }
      if (this.newDeal.value.id) {
        try {
          const changes = this.getChangedValues(this.newDeal);
          if (!this.arraysEqual(this.selectedDateChips, this.selectedDeal.exclude_dates)) {
            changes.exclude_dates = this.selectedDateChips;
          } else {
            delete changes.exclude_dates
          }
          // if (this.categoryArr.length > 0) {
          //   changes.deal_categories = [...this.selectedDeal.deal_categories || [], ...this.categoryArr]
          // }
          if (this.categoryArr.length > 0) {
            let combineArr = [...this.selectedDeal.deal_categories || [], ...this.categoryArr]
            const result = combineArr.filter((obj: any) => !this.uncheckedItems.includes(obj));
            changes.deal_categories = result
          } else {
            if (this.selectedDeal.deal_categories) {
              const result = this.selectedDeal.deal_categories.filter((obj: any) => !this.uncheckedItems.includes(obj));
              changes.deal_categories = result
            }
          }
          if (changes?.device_check) {
            changes.device_check = Number(changes.device_check)
          }
          if (changes?.is_locked) {
            changes.is_locked = Number(changes.is_locked)
          }
          // if (changes?.sold_out) {
          //   changes.sold_out = Number(changes.sold_out)
          // }
          if (changes?.referral || changes?.referral_mobile_verified) {
            Object.assign(changes, {
              lock_conditions: {
                referral: changes?.referral ? Number(changes?.referral) : Number(this.newDeal.value.referral),
                referral_mobile_verified: changes?.referral_mobile_verified ? Number(changes?.referral_mobile_verified) : Number(this.newDeal.value.referral_mobile_verified)
              },
            });
          }
          if (changes?.res_id) {
            let resId = this.resData.filter((option: { name: any; }) => option.name == changes?.res_id);
            changes.restaurant_id = resId[0].id
          }
          if (changes?.days) {
            changes.days = this.getSelectedDays()
          }
          if (changes?.template) {
            changes.template = this.newDeal.value.template == 'Normal' ? 0 : 1
          }
          changes.deal_id = this.selectedDeal.id;
          let imageUpload = this.arraysEqual(imageBannerIds, this.selectedDeal.images)
          if (!imageUpload) {
            changes.images = imageBannerIds;
          }
          if (homeImage != this.selectedDeal?.home_image?.uid) {
            changes.home_image = homeImage;
          }
          // if (this.selectedDeal.status == -4) {
          //   if (changes?.options?.length > 0) {
          //     this.renameKey(changes, 'options', 'deal_option');
          //   }
          //   Object.assign(changes, { 'status': 1 });
          //   this._appService.putApiWithAuth(`/admin/deal/update-draft`, changes, 1).subscribe({
          //     next: (success: any) => {
          //       this._appService.updateLoading(false);
          //       if (success.status_code === 200) {
          //         this.route.navigate(['/deal/list']);
          //         this.dialogRef.close({ event: 'close' });
          //         this._appService.success(success.msg);
          //       } else {
          //         this.route.navigate(['/deal/list']);
          //         // this.dialogRef.close({ event: 'close' });
          //         this._appService.err(success.msg);
          //       }
          //     },
          //     error: (error: any) => {
          //       this._appService.updateLoading(false);
          //       this._appService.err(error?.error?.msg);
          //       this.route.navigate(['/deal/list']);
          //       // this.dialogRef.close({ event: 'close' });
          //     }
          //   });
          // } else {

          if (changes?.options?.length > 0) {
            let filteredData = this.filterArrayOfObjects(changes.options);
            for (let index = 0; index < filteredData?.length; index++) {
              console.log('@@@after@@@',filteredData);
            
              if (filteredData[index]?.pax_details?.varies_per_pax) {
                let result = Object.values(filteredData[index]?.pax_details?.varies_per_pax);
                console.log('resultresult',result);
                console.log('filteredData[index]',filteredData[index]);
                filteredData[index].pax_details.varies_per_pax = result
              }
              console.log('@@before@@',filteredData);
            }
            // this.renameKey(changes, 'options', 'deal_option');
            // const keysToIgnore = ['created_at', 'show_on_home_page', 'deleted_at'];
            // const checkOption: any = this.getChangedValuesWithIgnoredKeys(this.processOptions(this.dealDataV2), this.processOptions(changes?.deal_option), keysToIgnore);

            // Check if pax_comission_type or pax_details has changed
            // checkOption.forEach((option: any, index: number) => {
            //   // If commission type or pax details have changed
            //   if (option?.pax_comission_type || (this.newDeal.value.options[index].pax_details)) {
            //     option.pax_comission_type = option?.pax_comission_type ?? this.newDeal.value.options[index].pax_comission_type;
            //     option.pax_details = option.pax_details
            //     option.discounted_price=this.newDeal.value.options[index].discounted_price
            //   }
            // });
            // console.log('==>>>checkOption', changes?.deal_option);
            changes.deal_option = filteredData
          }
          this._appService.putApiWithAuth(`/admin/deal/update`, changes, 1).subscribe({
            next: (success: any) => {
              this._appService.updateLoading(false);
              if (success.status_code === 200) {
                this.route.navigate(['/deal/list']);
                this.dialogRef.close({ event: 'close' });
                this._appService.success(success.msg);
              } else {
                this.route.navigate(['/deal/list']);
                // this.dialogRef.close({ event: 'close' });
                this._appService.err(success.msg);
              }
            },
            error: (error: any) => {
              this._appService.updateLoading(false);
              this._appService.err(error?.error?.msg);
              this.route.navigate(['/deal/list']);
              // this.dialogRef.close({ event: 'close' });

            }
          });
        } catch (error) {
          console.log(error)
        }

        // }
      } else {
        this._appService.postApiWithAuth('/admin/deal/create', data, 1).subscribe({
          next: (success: any) => {
            this._appService.updateLoading(false);
            if (success.status_code === 200) {
              this.route.navigate(['/deal/list']);
              this.dialogRef.close({ event: 'close' });
              this._appService.success(success.msg);
            } else {
              this._appService.err(success.msg);
            }
          },
          error: (error: any) => {
            this._appService.updateLoading(false);
            this._appService.err(error?.error?.msg);
          }
        });
      }
    } catch (error) {
      console.log(error)
      this._appService.updateLoading(false);
      // this._appService.err('Image upload failed');
    }
  }
  compareArrays = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Sort both arrays and compare each element
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  };
  saveDealAsDraft = async () => {
    this._appService.updateLoading(true);
    try {
      let imageBannerIds = this.imageData.map((item: any) => item.id);
      let homeImage = this.imageDataHome.id
      if (this.selectedDeal?.id && this.selectedDeal?.image_arr?.length > 0) {
        imageBannerIds = imageBannerIds.concat(this.selectedDeal.image_arr.map((image: any) => image.uid));
      }
      if (this.removeImagesArr.length > 0) {
        imageBannerIds = imageBannerIds.filter((id: any) => !this.removeImagesArr.includes(id));
      }
      console.log({ imageBannerIds }); console.log(this.imageData);
      console.log({ homeImage })
      let data: any = {
        is_draft: 1,
        title: this.newDeal.value.title ? this.newDeal.value.title : "",
        start_time: this.newDeal.value.start_time ? this.newDeal.value.start_time : '',
        end_time: this.newDeal.value.end_time ? this.newDeal.value.end_time : '',
        description: this.newDeal.value.description ? this.newDeal.value.description : '',
        // deal_option: this.newDeal.value.options ? this.newDeal.value.options : '',
        deal_highlights: this.newDeal.value.deal_highlights ? this.newDeal.value.deal_highlights : '',
        deal_conditions: this.newDeal.value.deal_conditions ? this.newDeal.value.deal_conditions : '',
        type: this.newDeal.value.type ? this.newDeal.value.type : '',
        campaign_id: this.newDeal.value.campaign_id ? this.newDeal.value.campaign_id : '',
        is_pilot: this.newDeal.value.is_pilot ? this.newDeal.value.is_pilot : '',
      };

      if (this.newDeal.value?.res_id) {
        let resId = this.resData.filter((option: { name: any; }) => option.name == this.newDeal.value?.res_id);
        Object.assign(data, { 'restaurant_id': resId[0].id });
      }
      if (this.newDeal.value.permitted_restaurant_ids) {
        Object.assign(data, { 'permitted_restaurant_ids': this.newDeal.value.permitted_restaurant_ids });
      }
      if (this.newDeal.value.days_validity) {
        Object.assign(data, { 'days_validity': this.newDeal.value.days_validity });
      }
      if (imageBannerIds.length > 0) {
        data.images = imageBannerIds;
      }
      if (homeImage != null) {
        data.home_image = homeImage
      } else {
        data.home_image = this.selectedDeal?.home_image?.uid
      }
      if (this.newDeal.value.id) {
        const changes = this.getChangedValues(this.newDeal);
        if (changes?.res_id) {
          let resId = this.resData.filter((option: { name: any; }) => option.name == changes?.res_id);
          changes.restaurant_id = resId[0].id
        }
        changes.deal_id = this.selectedDeal.id;
        let imageUpload = this.arraysEqual(imageBannerIds, this.selectedDeal.image_arr)
        if (!imageUpload) {
          changes.images = imageBannerIds;
        }
        // if (homeImage != this.selectedDeal?.home_image?.uid) {
        //   changes.home_image = homeImage;
        // }
        if (homeImage != null) {
          // // console.log('innnnnn');
          changes.home_image = homeImage
        } else {
          // console.log('oouutt');
          if (this.isRemove) {
            changes.home_image = []
          }
        }
        if (changes?.options?.length > 0) {
          this.renameKey(changes, 'options', 'deal_option');
          // if (this.dealDataV2.length > 0) {
          //   const keysToIgnore = ['created_at', 'show_on_home_page', 'deleted_at'];
          //   const checkOption = this.getChangedValuesWithIgnoredKeys(this.dealDataV2, changes?.deal_option, keysToIgnore);
          //   changes.deal_option = checkOption
          // }
        }
        this._appService.putApiWithAuth(`/admin/deal/update-draft-to-draft `, changes, 1).subscribe({
          next: (success: any) => {
            this._appService.updateLoading(false);
            if (success.status_code === 200) {
              this.route.navigate(['/deal/list']);
              this.dialogRef.close({ event: 'close' });
              this._appService.success(success.msg);
            } else {
              this.route.navigate(['/deal/list']);
              // this.dialogRef.close({ event: 'close' });
              this._appService.err(success.msg);
            }
          },
          error: (error: any) => {
            this._appService.updateLoading(false);
            this._appService.err(error?.error?.msg);
            this.route.navigate(['/deal/list']);
            // this.dialogRef.close({ event: 'close' });
          }
        });
      } else {
        if (this.newDeal.value?.options?.length > 0) {
          data.deal_option = this.newDeal.value?.options
        }
        this._appService.postApiWithAuth('/admin/deal/create-draft', data, 1).subscribe({
          next: (success: any) => {
            this._appService.updateLoading(false);
            if (success.status_code === 200) {
              this.route.navigate(['/deal/list']);
              this.dialogRef.close({ event: 'close' });
              this._appService.success(success.msg);
            } else {
              this._appService.err(success.msg);
            }
          },
          error: (error: any) => {
            this._appService.updateLoading(false);
            this._appService.err(error?.error?.msg);
          }
        });
      }
    } catch (error) {
      this._appService.updateLoading(false);
      // this._appService.err('Image upload failed');
    }
  }

  onFileSelected(fileInput: any) {
    // const input = fileInput.target as HTMLInputElement;
    // if (input.files && input.files.length > 0 && input.files.length <= 10) {

    //   Array.from(input.files).forEach(file => {
    //     if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 400 * 1024) {
    //       this.tournamentImage.push(file);
    //       const reader = new FileReader();
    //       this.imageSize = Number(this.imageSize) + Number(file.size)

    //       reader.onload = () => {
    //         this.imageURL.push(reader.result as string);
    //       };
    //       reader.readAsDataURL(file);
    //     } else {
    //       alert('Invalid file type or size exceeds 400KB limit.');
    //     }
    //   });
    // }
    const dialogRef = this.dialog.open(AddMediaComponent, {
      hasBackdrop: false,
      width: '800px',
      // height: '80px',
      data: {
        selectImage: true,
        preselectedItemId: this.imageURL.length > 0 ? this.imageURL : "",
        type: "deals",
        multiple: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && result.status) {
        console.log(result)
        this.imageData = result.value
        this.imageURL = this.imageData.map((item: any) => item.image);
        // console.log(this.imageData )
      }
    });

  }

  onFileSelectedv2(fileInput: any) {
    // const input = fileInput.target as HTMLInputElement;
    // if (input.files && input.files.length > 0 && input.files.length <= 10) {
    //   Array.from(input.files).forEach(file => {
    //     if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 400 * 1024) {
    //       const file: File = fileInput.target.files[0]
    //       this.imageSize = this._appService.formatBytes(file.size);
    //       this.images = file
    //       const reader = new FileReader();
    //       reader.onload = () => {
    //         this.image = reader.result as string;
    //       }
    //       reader.readAsDataURL(file)
    //     } else {
    //       alert('Invalid file type or size exceeds 400KB limit.');
    //     }
    //   });
    // }
    const dialogRef = this.dialog.open(AddMediaComponent, {
      hasBackdrop: false,
      width: '800px',
      // height: '80px',
      data: {
        selectImage: true,
        preselectedItemId: this.image ? this.image : "",
        type: "deals",
        multiple: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status) {
        console.log(result)
        this.imageDataHome = result.value
        this.image = this.imageDataHome.image;

      }
    });
  }
  convertTime = (time: string): string => {
    // Split the time by the colon and extract the first two parts (hours and minutes)
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  async updateCheckboxArray(data: any[], sourceArray: any[]) {
    console.log(data, sourceArray);

    if (sourceArray?.length > 0) {
      // Separate the array into checked and unchecked items
      const checkedItems = [];
      const uncheckedItems = [];

      for (let i = 0; i < sourceArray?.length; i++) {
        const itemId = sourceArray[i].uid;
        const isChecked = data?.some((item: any) => item === itemId);
        sourceArray[i]['checked'] = isChecked;

        if (isChecked) {
          checkedItems.push(sourceArray[i]);
        } else {
          uncheckedItems.push(sourceArray[i]);
        }
      }

      // Clear the sourceArray and push checked items followed by unchecked items
      sourceArray.length = 0;
      sourceArray.push(...checkedItems, ...uncheckedItems);
    }
  }
  setFormvalues = async () => {
    // this.isDisabled=true
    if (this.selectedDeal.type == 'free') {
      this.isDisabled = '1'
    } else {
      this.isDisabled = '2'
    }
    if (this.selectedDeal.images) {
      let homeImage = this.selectedDeal?.home_image?.url
      let allImage = this.selectedDeal.images
      this.image = homeImage;
      // let [, ...restImages] = allImage;
      this.imageURL = allImage;
    }
    if (!this.selectedDeal.type) {
      this.showAll = true
    } else {
      this.showAll = false
    }
    // this.categoryData = this.selectedDeal.deal_categories
    this.newDeal.patchValue({
      id: this.selectedDeal.id || null,
      res_id: this.selectedDeal.restaurant_name || null,
      title: this.selectedDeal.title || null,
      start_time: this.selectedDeal.start_time_parsed ? new Date(this.selectedDeal.start_time_parsed) : null,
      end_time: this.selectedDeal.end_time_parsed ? new Date(this.selectedDeal.end_time_parsed) : null,
      description: this.selectedDeal.description || null,
      image: this.selectedDeal.images,
      days_validity: this.selectedDeal.days_validity ? this.selectedDeal.days_validity.toString() : null,
      is_pilot: this.selectedDeal.is_pilot == 1 ? '1' : '0',
      deal_highlights: this.selectedDeal.deal_highlights,
      deal_conditions: this.selectedDeal.deal_conditions,
      type: this.selectedDeal.type,
      permitted_restaurant_ids: this.selectedDeal.permitted_restaurant_ids,
      device_check: this.selectedDeal.device_check.toString(),
      is_locked: this.selectedDeal.is_locked.toString(),
      free_with_nukhba_credits: this.selectedDeal.free_with_nukhba_credits?.toString(),
      // sold_out: this.selectedDeal.sold_out.toString(),
      campaign_id: this.selectedDeal?.campaign?.uid ? this.selectedDeal?.campaign?.uid : '',
      template: this.selectedDeal.template == 0 ? 'Normal' : 'Slot'
    });
    if (this.selectedDeal.is_locked == 1) {
      this.newDeal.patchValue({
        referral: this.selectedDeal?.lock_conditions?.referral.toString(),
        referral_mobile_verified: this.selectedDeal?.lock_conditions?.referral_mobile_verified.toString(),
      });
    }
    if (this.selectedDeal.slots && this.selectedDeal.slots.length > 0) {
      const slotsArray: any = this.newDeal.get('slots') as FormArray;
      slotsArray.clear();
      this.selectedDeal.slots.forEach((slot: any) => {
        slotsArray.push(this.fb.group({
          start_at: [this.convertTime(slot.start_at) || ''],
          end_at: [this.convertTime(slot.end_at) || ''],
          interval_in_mins: [slot.interval_in_mins ? slot.interval_in_mins.toString() : ""]
        }));
      });
      // console.log(slotsArray)

    }

    // Patch the days array
    if (this.selectedDeal.days) {
      const daysArray = this.newDeal.get('days') as FormArray;

      // Reset the form array
      this.weekDays.forEach((_, index) => {
        daysArray.at(index).setValue(false);  // Uncheck all first
      });

      // Map selected days to indices and set those controls to true
      this.selectedDeal.days.forEach((day: string) => {
        const dayIndex = this.weekDays.findIndex((weekDay: any) => weekDay.toLowerCase() === day.toLowerCase());
        if (dayIndex !== -1) {
          daysArray.at(dayIndex).setValue(true);  // Set the corresponding day to true
        }
      });

      // console.log(daysArray.value);  // You can log the array to verify the result
    }

    // Patch exclude_dates
    this.selectedDateChips = this.selectedDeal.exclude_dates ? [...this.selectedDeal.exclude_dates] : []
    this.newDeal.patchValue({
      exclude_dates: this.selectedDeal.exclude_dates || [],
    });
  };

  setOnlyOneHomePageOption(selectedOption: FormGroup) {
    this.option.controls.forEach(option => {
      if (option !== selectedOption) {
        option.get('show_on_home_page')?.setValue(0, { emitEvent: false });
      }
    });
  }

  setOnlyOneHomePageOption1(index: number) {
    this.option.controls.forEach((option, i) => {
      if (i !== index) {
        option.get('show_on_home_page')?.setValue("0", { emitEvent: false });
      }
    });
  }

  isHighlighted(option: any): boolean {
    const getData = this.resData.find((element: any) => element.name == option);
    if (getData) {
      return getData.is_pilot == 1 ? true : false
    } else {
      return false
    }
  }

  addOption(deal_option_id = '', title = '', actual_price = '', discounted_price = '', max_use = '', uses_per_user = '', show_on_home_page = '', quantity = "", pax_comission_type = "", pax_details = { fixed_per_pax: "", fixed_per_booking: "", varies_per_pax: [] }) {
    const winningForm = this.fb.group({
      deal_option_id: [deal_option_id],
      title: [title, Validators.required],
      actual_price: [actual_price, Validators.required],
      discounted_price: [discounted_price, Validators.required],
      max_use: [max_use, Validators.required],
      uses_per_user: [uses_per_user ? uses_per_user.toString() : '1', Validators.required],
      show_on_home_page: [show_on_home_page ? show_on_home_page.toString() : '0', Validators.required],
      max_qty_pr_purchase: [quantity, Validators.required],  // Add quantity
      pax_comission_type: [pax_comission_type ? pax_comission_type.toString() : "", Validators.required],
      pax_details: this.fb.group({
        fixed_per_pax: [""],
        fixed_per_booking: [""],
        varies_per_pax: this.fb.array([])
      })  // Dynamically updated based on type
    });
    winningForm.get('pax_comission_type')?.valueChanges.subscribe((value: any) => {
      const paxDetailsForm = winningForm.get('pax_details') as FormGroup;
      const variesPerPaxArray = paxDetailsForm.get('varies_per_pax') as FormArray;

      // Reset pax_details
      paxDetailsForm.reset();
      while (variesPerPaxArray.length) {
        variesPerPaxArray.removeAt(0);
      }

      const discountedPriceValue = winningForm.get('discounted_price')?.value || 0;

      // Adjust pax_details based on pax_comission_type
      if (value == '1') { // Fixed per pax
        paxDetailsForm.get('fixed_per_pax')?.setValue(discountedPriceValue);
      } else if (value == '3') { // Fixed per booking
        paxDetailsForm.get('fixed_per_booking')?.setValue(discountedPriceValue);
      } else if (value == '2') { // Varies per pax
        const quantityValue = winningForm.get('max_qty_pr_purchase')?.value || 0;

        for (let i = 0; i < Number(quantityValue); i++) {
          variesPerPaxArray.push(this.fb.group({
            amount: [i === 0 ? discountedPriceValue : '', Validators.required],  // Set 0th index to discounted price
            num_person: ['', Validators.required]
          }));
        }
      }
    });

    // Handle changes to discounted_price
    winningForm.get('discounted_price')?.valueChanges.subscribe((priceValue: any) => {
      const paxDetailsForm = winningForm.get('pax_details') as FormGroup;
      const paxComissionType = winningForm.get('pax_comission_type')?.value;

      // Update pax_details based on the selected pax_comission_type
      if (paxComissionType == '1') { // Fixed per pax
        paxDetailsForm.get('fixed_per_pax')?.setValue(priceValue);
      } else if (paxComissionType == '3') { // Fixed per booking
        paxDetailsForm.get('fixed_per_booking')?.setValue(priceValue);
      } else if (paxComissionType == '2') { // Varies per pax
        const variesPerPaxArray = paxDetailsForm.get('varies_per_pax') as FormArray;
        if (variesPerPaxArray.length > 0) {
          variesPerPaxArray.at(0).get('amount')?.setValue(priceValue);  // Set 0th index to discounted price
        }
      }
    });

    winningForm.get('show_on_home_page')?.valueChanges.subscribe((value: any) => {
      if (value === 1) {
        this.setOnlyOneHomePageOption(winningForm);
      }
    });
    // winningForm.get('pax_comission_type')?.valueChanges.subscribe((value: any) => {
    //   const paxDetailsForm = winningForm.get('pax_details') as FormGroup;
    //   paxDetailsForm.reset();  // Clear previous details

    //   // Adjust the form controls based on the pax_comission_type value
    //   if (value === 1) {
    //     paxDetailsForm.addControl('fixed_per_pax', new FormControl(5, Validators.required)); // Example default value: 5
    //   } else if (value === 2) {
    //     paxDetailsForm.addControl('varies_per_pax', this.fb.array([
    //       this.fb.group({ amount: 2, num_person: 1 }),
    //       this.fb.group({ amount: 4, num_person: 2 }),
    //       this.fb.group({ amount: 6, num_person: 3 })
    //     ]));
    //   } else if (value === 3) {
    //     paxDetailsForm.addControl('fixed_per_booking', new FormControl(9, Validators.required)); // Example default value: 9
    //   }
    // });
    winningForm.get('pax_comission_type')?.valueChanges.subscribe((value: any) => {

      const variesPerPaxArray = this.getVariesPerPax(winningForm); // Get the FormArray
      paxDetailsForm.reset();
      while (variesPerPaxArray.length) {
        variesPerPaxArray.removeAt(0);
      }

      if (value == 2) {

        const quantityValue = winningForm.get('max_qty_pr_purchase')?.value || 0;

        for (let i = 0; i < Number(quantityValue); i++) {
          variesPerPaxArray.push(this.fb.group({
            amount: ["", Validators.required],
            num_person: ["", Validators.required] // Default to 1 person
          }));
        }
      }
    });
    this.option.push(winningForm);
    const paxDetailsForm = winningForm.get('pax_details') as FormGroup;
    if (pax_comission_type == '1') {
      // Patch fixed_per_pax
      paxDetailsForm.patchValue({
        fixed_per_pax: pax_details?.fixed_per_pax || ""
      });
    } else if (pax_comission_type == '3') {
      // Patch fixed_per_booking
      paxDetailsForm.patchValue({
        fixed_per_booking: pax_details?.fixed_per_booking || ""
      });
    } else if (pax_comission_type == '2') {
      // Patch varies_per_pax (Array of objects)
      const variesPerPaxArray = paxDetailsForm?.get('varies_per_pax') as FormArray;
      variesPerPaxArray.clear();  // Clear any existing entries

      if (pax_details && pax_details?.varies_per_pax && pax_details?.varies_per_pax.length > 0) {
        pax_details?.varies_per_pax.forEach((paxDetail: any) => {
          const paxGroup = this.fb.group({
            amount: [paxDetail.amount],
            num_person: [paxDetail.num_person]
          });
          variesPerPaxArray.push(paxGroup);  // Push each entry
        });
      }
    }
  }
  addVariesPerPax(optionForm: any) {
    const variesPerPaxArray: any = this.getVariesPerPax(optionForm);
    variesPerPaxArray.push(this.fb.group({
      amount: ["", Validators.required],
      num_person: ["", Validators.required] // Default to 1 person
    }));
  }

  removeVariesPerPax(optionForm: any, index: number) {
    const variesPerPaxArray = this.getVariesPerPax(optionForm);
    if (variesPerPaxArray.length > 1) { // Prevent removal if only one remains
      variesPerPaxArray.removeAt(index);
    }
  }

  getVariesPerPax(optionForm: AbstractControl): FormArray {
    return optionForm.get('pax_details')?.get('varies_per_pax') as FormArray;
  }
  setFormvaluesv2 = () => {
    for (let i = 0; i < this.dealDataV2.length; i++) {
      this.addOption(this.dealDataV2[i].id, this.dealDataV2[i].title, this.dealDataV2[i].actual_price.toString(), this.dealDataV2[i].discounted_price.toString(), this.dealDataV2[i].max_use, this.dealDataV2[i].uses_per_user, this.dealDataV2[i].show_on_home_page, this.dealDataV2[i].max_qty_pr_purchase, this.dealDataV2[i].pax_comission_type, this.dealDataV2[i].pax_details);
    }
  }

  getRestaurantList = () => {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/merchants/restaurants?is_paginated=false&res_status=approved&type=deal`).subscribe((res: any) => {
      this.resData = res.data.rows;
      if (res.data.rows) {
        this.getBranchList(this.selectedDeal.restaurant_id, '1')
      }
      this.filterNames(res.data.rows)
      this._appService.hideSpinner();
    });
  };

  getCampaignList = () => {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/campaign/get?page_size=10&is_paginated=false&sort_by=created_at&order=desc&is_expired=0`).subscribe((res: any) => {
      this.campaignData = res.data.rows;

      this._appService.hideSpinner();
    });
  };

  filterNames = (list: any) => {
    for (let i = 0; i < list.length; i++) {
      this.options.push(list[i]['name']);
    }
  }

  getDealList = (dealId: any) => {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/deal/option-list?deal_id=${dealId}&is_paginated=false`).subscribe((res: any) => {
      this.dealDataV2 = res.data.rows;
      if (this.dealDataV2) {
        this.setFormvaluesv2();
      }
      this._appService.hideSpinner();
    });
  };


  getCategoryList = () => {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/categories?type=deal&is_paginated=false&status=1`).subscribe((res: any) => {
      this.categoryData = res.data.rows;
      if (this.categoryData && this.data.dealData.id) {
        this.updateCheckboxArray(this.selectedDeal.deal_categories, this.categoryData);
      }
      this._appService.hideSpinner();
    });
  };

  toggleShowAllCategories() {
    this.showAllCategories = !this.showAllCategories;
  }

  getDisplayedCategories() {
    return this.showAllCategories ? this.categoryData : this.categoryData.slice(0, 10);
  }

  onCategoryChange(data: any) {
    if (data.target.checked == true) {
      this.categoryArr.push(data.target.value);
    } else {
      this.uncheckedItems.push(data.target.value)
      // this.uncheckedItems = [...this.uncheckedItems, ...this.notCheckedData]
      // this.categoryArr = this.categoryArr.filter((category: any) => category !== data.target.value);
    }
    // this.newDeal.patchValue({
    //   deal_categories: this.categoryArr,
    // });
  }

  removeoption(winningIndex: number, id: any) {
    if (id.value.deal_option_id) {
      let sendBody = {
        "deal_option_id": id.value.deal_option_id
      }
      this._appService.deleteApi(`/admin/deal/delete-option`, sendBody, 1).subscribe({
        next:
          (success: any) => {
            if (success.success == true) {
              this._appService.success(success.msg)
            }
          },
        error: (error: any) => {
          this._appService.err(error?.error?.msg)
        }
      })
    }
    const control = <FormArray>this.newDeal.get('options');
    control.removeAt(winningIndex);
  }

  getBranchList(resId: any, status: any = null) {
    if (status == '1') {
      const merchantId = this.resData?.find((element: any) => element.id == resId);
      this._appService.showSpinner();
      this._appService.getApiWithAuth(`/admin/merchants/restaurants/${merchantId?.merchant.id}`).subscribe({
        next: (res: any) => {
          this.branchdata = res.data;
          this._appService.hideSpinner();
        }, error: (error: any) => {
          this._appService.updateLoading(false);
          this._appService.err(error?.error?.msg);
        }
      });
    } else {
      const merchantId = this.resData.find((element: any) => element.name == resId.value);
      this._appService.showSpinner();
      this._appService.getApiWithAuth(`/admin/merchants/restaurants/${merchantId?.merchant.id}`).subscribe({
        next: (res: any) => {
          this.branchdata = res.data;
          this._appService.hideSpinner();
        }, error: (error: any) => {
          this._appService.updateLoading(false);
          this._appService.err(error?.error?.msg);
        }
      });
    }
  }
}
