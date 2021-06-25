import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {MatRadioChange} from '@angular/material/radio';


@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  @Input() resetTime: boolean;
  @Input() changeDate: string;
  @Input() excludeTimes: string[];
  @Output() changeTime: EventEmitter<string> = new EventEmitter<string>();
  TimeSelected: string;
  nowTime: number;
  value: string;
  // Время записи
  times: string[];
  constructor() { }

  ngOnInit(): void {
    this.value = '';
    this.nowTime = new Date().getHours();
    // Рабочий промежуток по времени
    this.times = ['9', '10', '11', '12', '13', '14', '15', '16'];
  }

  selectedTime(event: MatRadioChange ): void {
    this.changeTime.emit(event.value);
  }

  ngOnChanges() {
    // При изменении даты, сбрасываем время
    if (this.resetTime === true){
      this.value = '';
      this.changeTime.emit();
    }
  }


}

