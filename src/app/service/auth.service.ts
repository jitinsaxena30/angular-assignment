import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

/**
 * AuthService provides authentication and user-related functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Checks if a user is currently logged in.
   * @returns `true` if a user is logged in; otherwise, `false`.
   */
  isloggedin() {
    return sessionStorage.getItem('username') != null;
  }

  /**
   * API URL for user-related operations.
   */
  apiurl = 'http://localhost:3000/user';

  /**
   * API URL for managing user secrets.
   */
  secretUrl = 'http://localhost:3000/mySecrets';

  /**
   * Logs the user out by clearing the session and navigating to the home page.
   */
  logOut() {
    console.log("before log out", sessionStorage.getItem("username"));
    sessionStorage.clear();
    console.log("after log out", sessionStorage.getItem("username"));
    this.router.navigate(['']);
  }

  /**
   * Registers a new user.
   * @param inputdata - User registration data.
   * @returns An HTTP POST request to the user registration API.
   */
  RegisterUser(inputdata: any) {
    return this.http.post(this.apiurl, inputdata);
  }

  /**
   * Retrieves user data by user ID.
   * @param id - User ID to fetch user data.
   * @returns An HTTP GET request to the user API with the specified user ID.
   */
  GetUserbyCode(id: any) {
    return this.http.get(this.apiurl + '/' + id);
  }

  /**
   * Retrieves user secrets by user ID.
   * @param id - User ID to fetch user secrets.
   * @returns An HTTP GET request to the user secrets API with the specified user ID.
   */
  getSecretsByCode(id: any) {
    return this.http.get(this.secretUrl + '/' + id);
  }

  /**
   * Adds a new secret for the user.
   * @param secret - User's secret data to be added.
   * @returns An HTTP POST request to the user secrets API.
   */
  addsecret(secret: any) {
    return this.http.post(this.secretUrl, secret);
  }

  /**
   * Updates user data by user ID.
   * @param id - User ID for which the data will be updated.
   * @param inputdata - Updated user data.
   * @returns An HTTP PUT request to the user secrets API with the specified user ID.
   */
  updateuser(id: any, inputdata: any) {
    console.log('inside API call', inputdata);
    console.log(id);
    return this.http.put(this.secretUrl + '/' + id, inputdata);
  }
}
