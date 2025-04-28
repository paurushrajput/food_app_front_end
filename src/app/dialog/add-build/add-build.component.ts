import { Component, Inject, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { BuildManagementComponent } from 'src/app/build-management/build-management.component';
import QuillType from 'quill';
import Delta from "quill"

@Component({
  selector: 'app-add-build',
  templateUrl: './add-build.component.html',
  styleUrls: ['./add-build.component.scss']
})
export class AddBuildComponent {
  selectedBuild: any
  buildform!: FormGroup
  editorContent: any;
  editorStyle = {
    height: '300px',
  };

  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<BuildManagementComponent>
  ) {
    this.buildForm()
  }

  buildForm = () => {
    this.buildform = this.fb.group({
      id: [''],
      version: ['', [Validators.required]],
      html_description: this.fb.array([]),
      // html_description: ['', [Validators.required]],
      force_update: ['', [Validators.required]],
      available_version: ['', [Validators.required]],
      label: ['', [Validators.required]],
      subTitle: ['', [Validators.required]],
      buttonName: ['', [Validators.required]],
      title: ['']
    })
  }
  get specialText() {
    return this.buildform.get('html_description') as FormArray;
  }
  addTextarea() {
    const textareaFormGroup = this.fb.group({
      text: ['']
    });
    this.specialText.push(textareaFormGroup);
  }

  removeTextarea(textarea: number, id: any) {
    console.log(textarea)
    const control = <FormArray>this.buildform.get('html_description');
    control.removeAt(textarea);
  }
  ngOnInit(): void {
    this.selectedBuild = this.data?.buildData;
    if (this.selectedBuild.id) {
      this.setFormvalues();
    }
  }


  saveBuildData() {
    this._appService.updateLoading(true)
    let sendData = {
      config_id: this.selectedBuild.id,
      value: {
        version: this.buildform.value.version,
        available_version: this.buildform.value.available_version,
        button_name: this.buildform.value.buttonName,
        sub_title: this.buildform.value.subTitle,
        description_label: this.buildform.value.label,
        force_update: this.buildform.value.force_update == '1' ? true : false,
        build: {
          title: this.buildform.value.title
        },
        html_description: this.buildform.value.html_description
      }
    }
    this._appService
      .putApiWithAuth(`/admin/app/app-version`, sendData, 1)
      .subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          console.log(success);
          if (success.success) {
            this._appService.success(success.msg)
            this.dialogRef.close({ event: 'close' });;
          } else {
            this._appService.err(success.msg)
            console.log('api error');
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error });
        },
      });
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'})
  }

  onFileSelected(data: any) { }

  setFormvalues = () => {
    console.log(this.selectedBuild.value.force_update);

    console.log(this.selectedBuild);
    this.buildform.patchValue({
      id: this.selectedBuild.id ? this.selectedBuild.id : null,
      title: this.selectedBuild?.value?.build?.title ? this.selectedBuild?.value?.build?.title : null,
      version: this.selectedBuild.value.version ? this.selectedBuild.value.version : null,
      deviceType: this.selectedBuild.value.deviceType ? this.selectedBuild.value.deviceType : null,
      html_description: this.selectedBuild.value.html_description ? this.selectedBuild.value.html_description : null,
      force_update: this.selectedBuild.value.force_update == true ? '1' : '0',
      available_version: this.selectedBuild.value.available_version ? this.selectedBuild.value.available_version : null,
      subTitle: this.selectedBuild.value.subTitle ? this.selectedBuild.value.subTitle : null,
      label: this.selectedBuild.value.label ? this.selectedBuild.value.label : null,
      buttonName: this.selectedBuild.value.buttonName ? this.selectedBuild.value.buttonName : null,

    });
    for (const specialText of this.selectedBuild?.value?.html_description) {
      console.log(specialText);
      this.addTextarea(); // Create a new form group
      this.specialText?.at(this.specialText.length - 1)?.get('text')?.setValue(specialText.text); // Set the value
    }
  };
}
