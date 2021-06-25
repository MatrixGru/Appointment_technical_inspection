import { Injectable } from '@angular/core';
import {Appointment} from '../helper/appointment';

@Injectable()
export class GlobalService {
  preloader: boolean;
  // Структура данных записи на ТО
  public appointment: Appointment;
  showAppointmentForm: boolean;
  public setting: any = {};

  constructor() {
  }

}
