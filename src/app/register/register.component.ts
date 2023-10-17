import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup } from "@angular/forms";
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as bcrypt from 'bcryptjs';

/**
 * RegisterComponent represents the component for user registration.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  /**
   * Represents the user registration form.
   */
  registerform: FormGroup = this.builder.group({
    id: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    name: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
    gender: this.builder.control('male'),
    role: this.builder.control(''),
    isactive: this.builder.control(false)
  });

  /**
   * Hashes a plain text password using bcrypt.
   * @param plainTextPassword - The plain text password to be hashed.
   * @returns A promise that resolves to the hashed password.
   */
  async hashPassword(plainTextPassword: string): Promise<string> {
    const saltRounds = 10; // You can adjust this value as needed
    return await bcrypt.hash(plainTextPassword, saltRounds);
  }

  /**
   * Attempts to register a user based on the provided registration form data.
   */
  async proceedregister() {
    if (this.registerform?.valid) { // Use optional chaining here

      // Safely access the password form control
      const passwordControl: AbstractControl | null = this.registerform?.get('password');
      if (passwordControl) {
        const plainTextPassword = passwordControl.value;

        if (plainTextPassword) { // Check if plainTextPassword is not null
          // Hash the password
          const hashedPassword = await this.hashPassword(plainTextPassword);

          // Update the form with the hashed password
          passwordControl.setValue(hashedPassword);
        } else {
          this.toastr.warning('Password field is empty.');
          return;
        }
      } else {
        this.toastr.warning('Password field not found.');
        return;
      }

      // Send the form data, including the hashed password, to the RegisterUser service
      this.service.RegisterUser(this.registerform.value).subscribe(result => {
        this.toastr.success('Please contact admin for enable access.', 'Registered successfully');
        const dataToAdd = {
          id: this.registerform.value.id,
          secret: []
        };
        this.service.addsecret(dataToAdd).subscribe();
        this.router.navigate(['login']);
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }
}
