import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';

@Injectable()
export class AppointmentService {
  pipe = new DatePipe('en-En'); // Use your own locale
  dataAppointment: object;

  constructor() {}

}
