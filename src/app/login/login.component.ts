import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import * as bcrypt from 'bcryptjs';

/**
 * LoginComponent represents the component for user login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    // Clear the session storage when the component is initialized.
    sessionStorage.clear();
  }

  /**
   * Stores the result of the user login attempt.
   */
  result: any;

  /**
   * Represents the login form with fields for user ID and password.
   */
  loginform = this.builder.group({
    id: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  });

  /**
   * Attempt to log in the user based on the provided credentials.
   */
  async proceedlogin() {
    if (this.loginform.valid) {
      this.service.GetUserbyCode(this.loginform.value.id).subscribe(async item => {
        this.result = item;
        console.log("Result", this.result);

        if (this.result && this.result.password) {
          const passwordMatch = await bcrypt.compare(
            <string>this.loginform.value.password, this.result.password
          );
          console.log(passwordMatch);

          if (passwordMatch) {
            // Store the username in session storage upon successful login.
            sessionStorage.setItem('username', this.result.id);
            console.log('Sessionid:', sessionStorage.getItem("username"));
            this.router.navigate(['secrets']);
            console.log('We are logged in to the safe area');
          } else {
            this.toastr.error('Invalid credentials');
          }
        } else {
          this.toastr.error('Invalid credentials');
        }
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }
}
