import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../model/global.service';
import {AngularFireDatabase} from '@angular/fire/database';


@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  title = 'Client';
  changeDate: string;
  changeTime: string;
  resetTime: boolean;
  public userData: any = {};
  public today: Date;
  errorMessage: string;
  closedDays: number[];
  excludeTimes: string[];
  dataAppointment: any;
  dateExclude: any;
  dateInclude: any;


  constructor(private firebase: AngularFireDatabase, public gd: GlobalService) {
    this.today = new Date();
  }

  ngOnInit(): void {
    // Подписка на получение данных из FireBase
    const currentDay = new Date();
    const nowDate = Date.parse(new Date().toLocaleDateString('en-En', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })).toString();
    // Выгружаем данные от текущей даты
    this.firebase.list('appointment').valueChanges().pipe().subscribe(
      data => {
        // Добавляем нерабочие даты
        this.dateExclude = data[1];
        // Исключаем таблицу блокирующую уничтожения таблицы
        delete this.dateExclude.block;
        // Добавляем рабочие даты
        this.dateInclude = data[2];
        // Исключаем таблицу блокирующую уничтожения таблицы
        delete this.dateInclude.block;
        // Получаем все даты записей
        this.dataAppointment = data[0];
        // Исключаем таблицу блокирующую уничтожения таблицы
        delete this.dataAppointment.block;
        // Формируем закрытые даты
        this.getClosedDaysFilter();
        // Отслеживаем изменение доступности времени
        this.trackingAvailablTime();
      }
    );
  }

  // Отслеживаем изменение доступности времени
  trackingAvailablTime(): void {
    const allDate = this.dataAppointment;
    for (const date in allDate) {
      // Если выбранная дата совпадает с итерируемой
      if (this.changeDate !== undefined && date === this.convertDate(this.changeDate)) {
        this.setBusyTimes(Number(date));
      }
    }
  }

  // обработка данных на поиск закрытых дней
  getClosedDaysFilter(): void {
    const tempClosedDays = new Array();
    //  Поиск дат в которых закрыты все 8 часов
    const allDate = this.dataAppointment;
    for (const date of Object.keys(allDate)) {
      // Получаем количество ключей по дате
      const countElementsObj = Object.keys(allDate[date]).length;
      // Если больше или равно 8, то добавляем в массив закрытых дат
      if (countElementsObj >= 8) {
        tempClosedDays.push(Number(date));
      }
    }
    this.closedDays = this.getExcludeDays(tempClosedDays);
  }

  // Получаем даты добавленные в недоступные для записи
  getExcludeDays(dateExclude: any[]): any[] {
    //  Поиск дат в которых закрыты все 8 часов
    const allDate = this.dateExclude;
    for (const ed of Object.keys(allDate)) {
      dateExclude.push(Number(ed));
    }
    return dateExclude;
  }

  // Фиксируем выбранную дату
  setChangeDate(event: string): void {
    this.changeDate = event;
    this.resetTime = true;
    this.setBusyTimes(Number(this.convertDate(event)));
  }

  // Фиксируем выбранное время
  setChangeTime(event: string): void {
    this.changeTime = event;
    this.resetTime = false;
  }

  // Заполняем данные по недоступным дням
  setClosedDays(event): void {
    this.closedDays = event;
  }

  // Заполняем время исключения по выбранной дате
  setBusyTimes(date: number): void {
    this.excludeTimes = [];
    if (this.dataAppointment[date] !== undefined) {
      this.excludeTimes = Object.keys(this.dataAppointment[date]);
    }

    // Исключаем прошедшее время
    const dateH = new Date();
    const nowHours = dateH.getHours();
    if (this.convertDate(dateH.toDateString()) === date.toString()) {
      for (let i = 9; i <= 16; i++) {
        if (i <= nowHours) {
          // Добавляем уникальное время, которого еще нет в списке
          if (this.excludeTimes.indexOf(i.toString()) === -1) {
            this.excludeTimes.push(i.toString());
          }
        }
      }
    }

    // Сбрасываем выбранное время если оно присутствует в списке занятых
    if (this.excludeTimes.indexOf(this.changeTime) !== -1) {
      this.resetTime = true;
    }
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

}
