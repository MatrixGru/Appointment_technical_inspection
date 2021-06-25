import {Component, Input, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-out-records',
  templateUrl: './out-records.component.html',
  styleUrls: ['./out-records.component.css']
})
export class OutRecordsComponent implements OnInit {

  @Input() records: object;
  p = 1;

  constructor(private firebase: AngularFireDatabase) { }

  ngOnInit(): void {
  }

  // Удаляем запись
  deleteRecords(dateTime: string): void {
    // Если переданы не пустые данные
    if (!dateTime || 0 !== dateTime.length) {
      // Разбиваем строку для получения даты и времени
      const tempDataTime = dateTime.split(':');
      const delData = this.reverseConvertDate(tempDataTime[0]);
      const delTime = tempDataTime[1] + ':00';
      // Если не пустые дата и время - пытаемся удалить данные
      if ((!tempDataTime[0] || 0 !== tempDataTime[0].length) && (!tempDataTime[1] || 0 !== tempDataTime[1].length)) {
        if (confirm('Вы уверены что хотите удалить запись на время: ' + delData + ' ' + delTime)) {
          // Удаляем данные путём добавление в нужное время NULL
          this.firebase.database.ref('/appointment/date/' + tempDataTime[0] + '/')
            .child(tempDataTime[1])
            .set(null, (error) => {
              if (error) {
                alert('Ошибка удаления записи: ' + error.message);
              }
            });
        }
      }
    }
  }

  // Конвертация Unix в дату
  reverseConvertDate(dateConvert: string): string {
    return new Date(Number(dateConvert)).toLocaleDateString('en-GB');
  }

  addDescription(desc: HTMLTextAreaElement, dateTime: string): void {
    // Если переданы не пустые данные
    if (!dateTime || 0 !== dateTime.length) {
      // Разбиваем строку для получения даты и времени
      const tempDataTime = dateTime.split(':');
      const delData = this.reverseConvertDate(tempDataTime[0]);
      const delTime = tempDataTime[1] + ':00';
      // Если не пустые дата и время - пытаемся удалить данные
      if ((!tempDataTime[0] || 0 !== tempDataTime[0].length) && (!tempDataTime[1] || 0 !== tempDataTime[1].length)) {
        if (confirm('Вы уверены что хотите изменить описание записи: ' + delData + ' ' + delTime)) {
          // Удаляем данные путём добавление в нужное время NULL
          this.firebase.database.ref('/appointment/date/' + tempDataTime[0] + '/' + tempDataTime[1])
            .child('description')
            .set(desc.value, (error) => {
              if (error) {
                alert('Ошибка добавления описания: ' + error.message);
              } else {
                alert('Успешно изменено');
              }
            });
        }
      }
    }
  }
}
