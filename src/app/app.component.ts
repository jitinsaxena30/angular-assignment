import { Component } from '@angular/core';
import {AuthService} from "./service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'login_signup';

  constructor(private authservice:AuthService,private router:Router) {
  }

  logOut(){
  this.authservice.logOut()
}

  secretValication(){
    if(this.authservice.isloggedin()){
       console.log(this.authservice.isloggedin())
      this.router.navigate(['secrets']);
    }
  }

}
