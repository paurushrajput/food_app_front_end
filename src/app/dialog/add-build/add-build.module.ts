import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill'
import { AddBuildComponent } from './add-build.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [
        AddBuildComponent
    ],
    imports: [
        MatSliderModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatPaginatorModule,
        FormsModule, ReactiveFormsModule,
        MatCardModule,
        FlexLayoutModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        BrowserModule,
        QuillModule.forRoot({
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['underline'],
                ],
            },
        }),
    ],
})
export class AddBuildModule { }
