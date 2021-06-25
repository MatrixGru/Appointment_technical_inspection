import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {GlobalService} from '../model/global.service';
import {Appointment} from '../helper/appointment';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit {

  params: Appointment;

  constructor(private gd: GlobalService) { }

  ngOnInit(): void {
    this.params = this.gd.appointment;
  }

}
