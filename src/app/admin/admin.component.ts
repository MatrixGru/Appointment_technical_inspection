import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../model/auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  records: any[];
  closedDays: any;
  openDays: any;
  users: any;
  isAdmin: boolean;

  constructor(private firebase: AngularFireDatabase, public authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.isAdmin = false;
    this.firebase.list('appointment').valueChanges().pipe().subscribe(
      data => {
        console.log('Data: ', data);
        this.getAllrecords(data);
      }
    );
  }

  // формирование списка всех записей
  getAllrecords(data: object): void {
    const records = new Array();
    for (const dates of Object.keys(data[0])) {
      // Исключаем из обработки блокировку таблицы от уничтожения
      if (dates === 'block') { continue; }
      // Получаем временные интервалы по каждой дате
      const times = Object.keys(data[0][dates]);
      for (const time of Object.keys(times)){
        records.push(data[0][dates][times[time]]);
      }
    }
    this.closedDays = data[1];
    delete this.closedDays.block;
    this.openDays = data[2];
    delete this.openDays.block;
    this.users = data[3];
    delete this.users.block;
    console.log('admin: ', this.authService.userData.email);
    console.log('alladmin: ', this.users);
    for (const admin of Object.keys(this.users)) {
      if (this.users[admin] === this.authService.userData.email){
        this.isAdmin = true;
        break;
      }
    }
    this.records = records.reverse();
  }



}
