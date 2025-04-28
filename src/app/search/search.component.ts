import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'; // Import FormControl

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{
  searchForm!: FormGroup;
  searchTextNotEmpty: boolean = false;

  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() clearEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
 
  }
ngOnInit(): void {
     this.searchForm =  new FormGroup({
      name: new FormControl('')
    });
}
  checkSearchText(event: KeyboardEvent) {
    console.log(this.searchForm.value)
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0 // Use .get('name') to retrieve the FormControl
    if (event.key === "Enter") {
      this.search();
    }
  }

  search() {
    this.searchEvent.emit(this.searchForm.value.name.trim());
  }

  clear() {
    this.searchForm.reset();
    this.searchTextNotEmpty = false;
    this.clearEvent.emit();
  }
}
