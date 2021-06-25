import {Component, Input, OnInit} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-work-days',
  templateUrl: './work-days.component.html',
  styleUrls: ['./work-days.component.css']
})
export class WorkDaysComponent implements OnInit {

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

  // Добавляем в БД закрытых дней
  addWorkDay(picker: MatDatepicker<any>): void {
    if (confirm('Вы уверены что хотите добавить день в открытый для записи: ' + this.reverseConvertDate(this.convertDate(picker.startAt)))) {
      // Удаляем данные путём добавление в нужное время NULL
      this.firebase.database.ref('/appointment/include/')
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

  // Удаляем из БД дату
  deleteWorkDay(key: string): void {
    if (confirm('Вы уверены что хотите удалить день из открытых для записи: ' + this.reverseConvertDate(key))) {
      // Удаляем данные путём добавление в нужное время NULL
      this.firebase.database.ref('/appointment/include/')
        .child(key)
        .set(null, (error) => {
          if (error) {
            alert('Ошибка удаления записи: ' + error.message);
          }
        });
    }
  }

}
