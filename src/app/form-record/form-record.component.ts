import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Appointment} from '../helper/appointment';
import {GlobalService} from '../model/global.service';
import {Status} from '../Enum/Status';
import {Role} from '../Enum/Role';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';



@Component({
  selector: 'app-form-record',
  templateUrl: './form-record.component.html',
  styleUrls: ['./form-record.component.css']
})
export class FormRecordComponent implements OnInit {

  @Input() changeDate: string;
  @Input() changeTime: number;
  @Input() dataAppointment: object;
  appoitmentForm: FormGroup;
  submitValidate: boolean;
  pipe = new DatePipe('en-En'); // Use your own locale
  submitted: boolean;
  errorMessage: string;
  successMessage: string;
  formErrors: any;
  elementValues: Appointment;

  constructor(private http: HttpClient, private firebase: AngularFireDatabase, private fb: FormBuilder, private router: Router, private gd: GlobalService) {
  }

  ngOnInit(): void {

    this.appoitmentForm = this.fb.group({
      fio: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      category: ['', [Validators.required]],
      mark: ['', [Validators.required]],
      datex: ['', [Validators.required]],
      time: ['', [Validators.required]]
    });

  }

  // Статус валидности контрола
  isControlInvalid(controlName: string, stage: boolean = false): boolean {
    const control = this.appoitmentForm.controls[controlName];
    const result = control.invalid;
    if (control.value === '' && stage === false) {
      return false;
    }
    return result;
  }

  setFormErrors(errorFields: any): void {
    for (const key in errorFields) {
      // skip loop if the property is from prototype
      if (!errorFields.hasOwnProperty(key)) {
        continue;
      }

      this.formErrors[key].valid = false;
      this.formErrors[key].message = errorFields[key];
    }
  }


  onSubmit(elementValues: Appointment): void {
    elementValues.time = this.changeTime;
    this.appoitmentForm.controls.time.setValue(elementValues.time);
    elementValues.datex = this.changeDate;
    this.appoitmentForm.controls.datex.setValue(elementValues.datex);
    const controls = this.appoitmentForm.controls;
    // Валидация данных
    if (this.appoitmentForm.invalid) {
      this.submitValidate = true;
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.submitted = true;
    elementValues.datex = Date.parse(new Date(this.changeDate).toLocaleDateString('en-En', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })).toString();
    elementValues.status = Status.STATUS_ACTIVE;
    elementValues.role = Role.ROLE_USER;
    elementValues.description = '';

    this.elementValues = elementValues;

    let addNewRecord = false; // Флаг можно ли записывать данные на текущее выбранное время
    if (this.dataAppointment.hasOwnProperty(elementValues.datex)){
      const timesDate = Object.keys(this.dataAppointment[elementValues.datex]);
      if (timesDate.indexOf(this.changeTime.toString()) === -1){
        addNewRecord = true;
      } else {
        addNewRecord = false;
      }
    } else {
      addNewRecord = true;
    }

    // Проверка на возможное пересечение дат
    if (addNewRecord === true) {
      // Записываем данные
      this.firebase.database.ref('/appointment/date/')
        .child(elementValues.datex + '/' + this.changeTime)
        .set(elementValues, (error) => {
          if (error) {
            this.errorMessage = error.message;
          } else {
            this.gd.appointment = this.elementValues;
            this.sendEmail();
            this.router.navigate(['success']);
          }
        });
    } else {
      this.errorMessage = 'Данное время уже занято. Запись не возможна. Выберите другое время';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    }
  }

  // Отправка письма
  sendEmail(): void{
    let Params = new HttpParams();
    Params = Params.append('email', this.elementValues.email);
    Params = Params.append('name', this.elementValues.fio);
    Params = Params.append('message', 'Вы выполнили запись на прохождение ТО: ' + this.reverseConvertDate(this.elementValues.datex) + ' на ' + this.elementValues.time + ':00');
    this.http.post('sendEmail.php', Params)
      .subscribe(
        response => console.log('Success: ', response),
        response => console.log('Error: ', response)
      );
  }

  // Конвертация Unix в дату
  reverseConvertDate(dateConvert: string): string {
    return new Date(Number(dateConvert)).toLocaleDateString('en-GB');
  }

}
