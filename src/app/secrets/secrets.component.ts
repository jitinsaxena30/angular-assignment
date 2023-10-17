import { Component, OnInit } from '@angular/core';
import { AuthService } from "../service/auth.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

/**
 * SecretsComponent represents the component for managing user secrets.
 */
@Component({
  selector: 'app-secrets',
  templateUrl: './secrets.component.html',
  styleUrls: ['./secrets.component.css']
})
export class SecretsComponent implements OnInit {
  /**
   * Stores user secrets retrieved from the server.
   */
  data: any;

  /**
   * Array to store the user's secrets.
   */
  secrets: any;

  /**
   * An object to hold user data.
   */
  mydata!: Object;

  /**
   * Stores the full secret.
   */
  fullsecret: any;

  constructor(private authService: AuthService, private builder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getSecrets();
  }

  /**
   * Fetches the user's secrets from the server.
   */
  getSecrets() {
    this.authService.getSecretsByCode(sessionStorage.getItem("username")).subscribe((data) => {
      this.data = data;
      this.secrets = this.data.secret;
      console.log('all of my secrets', this.secrets);
    });
  }

  /**
   * Represents the form for adding a new secret.
   */
  secretForm: FormGroup = this.builder.group({
    secret: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    id: [sessionStorage.getItem('username'), Validators.required]
  });

  /**
   * Adds a new secret to the user's secrets.
   */
  async addSecret() {
    console.log(this.secretForm.value);
    if (this.secrets !== null) {
      let newSecret;
      this.authService.getSecretsByCode(sessionStorage.getItem("username")).subscribe((data) => {
        this.data = data;
        this.data.secret.push(this.secretForm.value.secret);
        this.authService.updateuser(sessionStorage.getItem('username'), this.data).subscribe(
          response => {
            console.log('PUT request response:', response);
            this.getSecrets();
          },
          error => {
            console.error('PUT request error:', error);
          }
        );
      });
    } else {
      console.log('rahul');
      this.authService.addsecret(this.secretForm.value).subscribe();
      this.getSecrets();
    }
  }
}
