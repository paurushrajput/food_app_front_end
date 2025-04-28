import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HostBinding } from '@angular/core';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss']
})
export class InputBoxComponent {
  @HostBinding('style.height') height = '56px';
  @Input('formgroup')
  formgroup!: FormGroup;
  @Input('params') params: any;
  constructor(private formBuilder: FormBuilder) {
   
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
   

  }
  onInputChange(event:any) {
    const input = event.target.value;
    const withoutSpecialChars = input.replace(/[^\w\s]/gi, ''); // Remove special characters
    if (input !== withoutSpecialChars) {
      console.log(withoutSpecialChars)
      this.formgroup.get(this.params.controls)?.setValue(withoutSpecialChars);
    }
  }

}

