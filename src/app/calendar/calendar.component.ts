import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {AppointmentService} from '../model/appointment.service';
import {DatePipe} from '@angular/common';
import {GlobalService} from '../model/global.service';


export interface FreeTimes {
  time: number[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  selectedDate: string;
  nowDate: number;
  currentDay: Date;
  pipe = new DatePipe('en-En'); // Use your own locale
  errorMessage: string;
  @Output() changeDate: EventEmitter<string> = new EventEmitter<string>();
  @Input() closedDays: number[];
  @Input() dateInclude: number[];


  constructor(private gd: GlobalService, private appointmentService: AppointmentService) {
    this.selectedDate = new Date().toString();
  }

  ngOnInit(): void {
    this.currentDay = new Date();
    this.nowDate = Date.parse(new Date().toLocaleDateString('en-En', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }));
    this.changeDate.emit(this.selectedDate);
  }

  // Пример исключения субботы и воскресенья, а также переданных занятых дат
  filterDates = (date: Date): boolean => {
    let closedDate: number;
    const positionDate = Date.parse(new Date(date).toLocaleDateString('en-En', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }));
    // Делаем не активными даты на которых время записи не доступно
    for (const el of Object.keys(this.closedDays)) {
      closedDate = Number(this.closedDays[el]);
      // Если текущий день выпадает на занятый, то снимаем активный день
      if (this.nowDate === closedDate) {
        this.changeDate.emit('');
      }
      if (closedDate === positionDate) {
        return false;
      }
    }
    // Включаем день если добавлен в список доступных
    if (this.dateInclude.hasOwnProperty(positionDate) === true){
      return true;
    }

    // Если текущий день выпадает на выходные, то снимаем активный день
    //if ((this.currentDay.getDay() === 0 || this.currentDay.getDay() === 6)) {
     // this.changeDate.emit('');
    //}

    // Делаем выходные (суббота, воскресенье не доступными)
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  // Обработка выделенной даты
  onSelect(event: string): void {
    // Выбранный элемент подсвечивает классом selected
    this.selectedDate = event;
    this.changeDate.emit(this.selectedDate);
  }

}
