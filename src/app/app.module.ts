import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CalendarComponent} from './calendar/calendar.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {TimeComponent} from './time/time.component';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, MAT_DATE_FORMATS} from '@angular/material/core';
import {FormRecordComponent} from './form-record/form-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {RouterModule, Routes} from '@angular/router';
import {MomentModule} from 'ngx-moment';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppointmentComponent} from './appointment/appointment.component';
import {LoginComponent} from './login/login.component';
import {environment} from '../environments/environment';
import {AppointmentService} from './model/appointment.service';
import {SuccessPageComponent} from './success-page/success-page.component';
import {LocaleDateStringPipe} from './pipe/locale-date-string.pipe';
import {AdminComponent} from './admin/admin.component';
import {GetRecordsComponent} from './admin/get-records/get-records.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {AuthService} from './model/auth.service';
import {AuthGuard} from './shared/guard/auth.guard';
import {NgxPaginationModule} from 'ngx-pagination';
import { OutRecordsComponent } from './admin/out-records/out-records.component';
import {MatTabsModule} from '@angular/material/tabs';
import { NotWorkDaysComponent } from './admin/not-work-days/not-work-days.component';
import { WorkDaysComponent } from './admin/work-days/work-days.component';
import {MatInputModule} from '@angular/material/input';
import {GlobalService} from './model/global.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

// определение маршрутов
const appRoutes: Routes = [
  {path: '', component: AppointmentComponent},
  {path: 'login', component: LoginComponent},
  {path: 'success', component: SuccessPageComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
];


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    TimeComponent,
    FormRecordComponent,
    AppointmentComponent,
    LoginComponent,
    SuccessPageComponent,
    LocaleDateStringPipe,
    AdminComponent,
    GetRecordsComponent,
    OutRecordsComponent,
    NotWorkDaysComponent,
    WorkDaysComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatDividerModule,
    FormsModule,
    MomentModule,
    RouterModule.forRoot(appRoutes),
    NgxPaginationModule,
    MatTabsModule,
    MatInputModule,
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    MatDatepickerModule, MatNativeDateModule, MatRadioModule, {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    AppointmentService,
    AuthService,
    GlobalService,
    HttpClient,
    AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
