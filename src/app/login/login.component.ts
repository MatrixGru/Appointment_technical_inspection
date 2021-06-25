import {Component, OnInit} from '@angular/core';
import {AuthService} from '../model/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {


  constructor(public authService: AuthService, private router: Router) {
  }


  ngOnInit() {
    setTimeout(() => {
      if (this.authService.isLoggedIn === true) {
        this.router.navigate(['admin']);
      }}, 3000);
  }

}
