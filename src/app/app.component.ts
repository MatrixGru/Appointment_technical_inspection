import {ChangeDetectorRef} from '@angular/core';
import {Component, OnInit} from '@angular/core';

import {GlobalService} from './model/global.service';
import {AuthService} from './model/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  // @Output() resetTime: EventEmitter<boolean> = new EventEmitter<boolean>();

  title = 'Client';
  public userData: any = {};
  public today: Date;

  constructor(public authService: AuthService, private cdRef: ChangeDetectorRef, public gd: GlobalService) {
    this.today = new Date();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
  }


}
