import {Component, Input, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-not-work-days',
  templateUrl: './not-work-days.component.html',
  styleUrls: ['./not-work-days.component.css']
})
export class NotWorkDaysComponent implements OnInit {

  @Input() records: object;
  p = 1;

  constructor(private firebase: AngularFireDatabase) { }

  ngOnInit(): void {
  }

  // Конвертиция даты в unix
  convertDate(dateConvert: string): string {
    return Date.parse(new Date(dateConvert).toLocaleDateString('en-En', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })).toString();
  }
  // Конвертация Unix в дату
  reverseConvertDate(dateConvert: string): string {
    return new Date(Number(dateConvert)).toLocaleDateString('en-GB');
  }

  // Удаляем из БД дату
  deleteClosedDay(key: string): void {
    if (confirm('Вы уверены что хотите удалить день из закрытых для записи: ' + this.reverseConvertDate(key))) {
      // Удаляем данные путём добавление в нужное время NULL
      this.firebase.database.ref('/appointment/exclude/')
        .child(key)
        .set(null, (error) => {
          if (error) {
            alert('Ошибка удаления записи: ' + error.message);
          }
        });
    }
  }

  // Добавляем в БД закрытых дней
  addClosedDay(picker: MatDatepicker<any>): void {
    if (confirm('Вы уверены что хотите добавить день в закрытую для записи: ' + this.reverseConvertDate(this.convertDate(picker.startAt)))) {
      // Удаляем данные путём добавление в нужное время NULL
      this.firebase.database.ref('/appointment/exclude/')
        .child(this.convertDate(picker.startAt))
        .set('1', (error) => {
          if (error) {
            alert('Ошибка добавления записи: ' + error.message);
          } else {
            alert('Добавлено успешно');
          }
        });
    }
  }
}
