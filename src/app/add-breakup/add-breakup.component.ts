import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { WinnerBreakupComponent } from '../winner-breakup/winner-breakup.component';

@Component({
  selector: 'app-add-breakup',
  templateUrl: './add-breakup.component.html',
  styleUrls: ['./add-breakup.component.scss']
})
export class AddBreakupComponent {

  value: any;
  breakupData: any = [];
  submitted: any = false
  formInvalid: any = false
  matchData: any = [];
  leagueData: any = [];
  toursData: any = [];
  winningData: any = {};
  sportsType: any = [];
  newBreakup!: FormGroup;
  winningForm!: FormGroup;
  selectedContest: any;
  div1: boolean = false;
  dynamicRows: number[] = [1];
  entity_id: any
  image: any
  imageSize: any;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    public _appService: AppService,
    // private mycomp:MycomponentComponent,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WinnerBreakupComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.selectedContest = this.data.breakupData;
    this.winningData = this.data.breakupData.breakup;
    this.newBreakup.get('name')?.valueChanges.subscribe(value => {
      if (value) {
        const titleCased = this.toTitleCase(value);
        this.newBreakup.get('name')?.setValue(titleCased, { emitEvent: false });
      }
    });
    if (Object.keys(this.selectedContest).length !== 0)
      this.setFormvalues();
  }
  toTitleCase(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'});
  }

  buildForm = () => {
    this.newBreakup = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      // isActive: [''],
      // category: ['', [Validators.required]],
      break_up: this.fb.array([]),
    });
  };

  get break_up() {
    return this.newBreakup.controls['break_up'] as FormArray;
  }

  // onFileSelect(fileInput: any, index: any) {
  //   if (fileInput.target.files.length > 0) {
  //     const file: File = fileInput.target.files[0]
  //     this.imageSize = this._appService.formatBytes(file.size);
  //     // this.categoryImage = file
  //     this.break_up.controls[index].get('imageFile')?.setValue(file);
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       // Update the 'image' property for the specific item in the 'break_up' array
  //       this.break_up.controls[index].get('image')?.setValue(reader.result as string);
  //     };

  //     reader.readAsDataURL(file);

  //   }
  // }
  trackByIndex(index: number): number {
    return index;
  }

  onFileSelect(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    console.log(index)
    if (fileInput.files && fileInput.files.length > 0) {
      const file: File = fileInput.files[0];
      this.imageSize = this._appService.formatBytes(file.size);
  
      // Set the file object to 'imageFile' control
      this.break_up.at(index).get('imageFile')?.setValue(file);
  
      const reader = new FileReader();
      reader.onload = () => {
        // Set the base64 string to the 'image' control
        this.break_up.at(index).get('image')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  addWinnings(rankFrom = '', rankTo = '', amount = '') {
    const winningForm = this.fb.group({
      id: [''],
      rank: ['', Validators.required],
      // rank_to: ['', Validators.required],
      // price_amount: ['', Validators.required],
      // type: ['', Validators.required],
      image: ['', Validators.required],
      imageFile: ['']
    });

    this.break_up.push(winningForm);
  }

  removeWinning(winningIndex: number, id: any) {
    const control = <FormArray>this.newBreakup.get('break_up');
    control.removeAt(winningIndex);
  }

  uploadImage(image: any) {
    if (image) {
      let formData = new FormData();
      formData.append('file', image)
      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                // this._appService.success('Image upload successfully')
                return resolve(success.data.media_id)
              }
            },
          error: (error: any) => {
            this._appService.err(error?.error?.msg)
          }
        })
      });
      return promise
    } else {
      return null;
    }
  }
  async saveBreakup() {

    if (this.newBreakup.invalid) {
      this.formInvalid = true;
      this.submitted = true;
      return;
    }
    this._appService.updateLoading(true)

    this.submitted = false;

    const breakUpArray = this.newBreakup.value.break_up;

    // Use Promise.all to wait for all image uploads to complete
    try {
      const updatedBreakUpArray = await Promise.all(
        breakUpArray.map(async (item: any) => {
          const image = item.imageFile;

          // Upload the image for the current item
          const mediaId = await this.uploadImage(image);

          // Update the item with the mediaId
          return { ...item, image: mediaId };
        })
      );

      const data = {
        break_up: updatedBreakUpArray,
        name: this.toTitleCase(this.newBreakup.value.name)
      };



      this._appService.postApiWithAuth('/admin/winner-breakup/', data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          console.log(success);
          if (success.status_code === 200) {
            // this.route.navigate(['/contest/list']);
            this.dialogRef.close({ event: 'close' });
          } else {
            console.log('API error');
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          this._appService.err(error?.error?.msg)
          console.log({ error });
        },
      });
    } catch (error) {
      console.log('Error uploading images:', error);
    }
  }


  private setControl(data: any): FormGroup {
    return this.fb.group({
      rank: [data.rank],
      // rank_to: [data.rank_to],
      id: [data.id],
      image: [data.image]
      // price_amount: [data.price_amount],
    });
  }

  setFormvalues = () => {
    this.winningData.forEach((x: any) => {
      this.break_up.controls.push(this.setControl(x));
    });
    this.newBreakup.patchValue({
      _id: this.selectedContest._id ? this.selectedContest._id : null,
      name: this.selectedContest.name ? this.selectedContest.name : null,
      break_up: this.break_up.value,
    });
  };

  showTable() {
    this.dynamicRows.push(this.dynamicRows.length);
  }

  removeRow() {
    this.dynamicRows.pop();
  }
}
