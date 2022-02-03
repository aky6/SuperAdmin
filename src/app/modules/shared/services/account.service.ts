import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { User } from './../models/user';
import { Tokens } from './../models/tokens';
import { environment } from '../../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  decodedToken: any;
  currentUser: string;
  private hideHeader: boolean;
  hideHeaderStatusChange: Subject<boolean> = new Subject<boolean>();
  jwtHelper = new JwtHelperService();
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.userSubject = new BehaviorSubject<User>(
      this.jwtHelper.decodeToken(localStorage.getItem(this.JWT_TOKEN))
    );
    this.user = this.userSubject.asObservable();
    this.hideHeader = false;
  }

  getHeaderDisplayStatus(): boolean {
    return this.hideHeader;
  }

  setHeaderDisplayStatus(isView: boolean) {
    this.hideHeader = isView;
    this.hideHeaderStatusChange.next(this.hideHeader);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  private doLoginUser(tokens: Tokens) {
    this.storeTokens(tokens);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    const decodedToken = this.jwtHelper.decodeToken(tokens.token);
    this.userSubject.next(decodedToken);
    const vendorId = decodedToken.user.vendorId;
    this.currentUser = decodedToken.user.firstname;
    localStorage.setItem('vendorId', vendorId);
  }

  getUserId() {
    return localStorage.getItem('vendorId');
  }

  login(email: string, password: string) {
    let cred = {
      email_Id: email,
      password: password,
    };

    return this.http.post<User>(`${environment.apiUrl}/Adminlogin`, cred).pipe(
      tap((data: any) =>
        this.doLoginUser({ token: data.token, refreshToken: data.token })
      ),
      catchError((err) => this.handleError(err))
    );
  }
  updatesubcategory(subcatid, name) {
    let cred = {
      name: name,
      subcatId: subcatid
    }
    return this.http.put<User>(`${environment.apiUrl}/updatesubcategoryname`, cred)

      .pipe(

        catchError((err) => this.handleError(err))
      );
  }
  logout() {
    // remove user from local storage and set current user to null
    this.currentUser = null;
    this.removeTokens();
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('vendorId');
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  register(user: any, role: string) {
    let newUser = {
      firstName: user.firstName,
      lastname: user.lastName,
      email_Id: user.email,
      user_desc: user.userName,
      mobileNumber: user.mobileNumber,
      password: user.password,
      zip: user.zip,
      state: user.state,
      city: user.city,
      roles: role,
      address: user.address,
    };
    return this.http
      .post(`${environment.apiUrl}/AdminSignUp`, newUser)
      .pipe(catchError((err) => this.handleError(err)));
  }
  getcategory() {
    return this.http.get(`${environment.apiUrl}/categorywithsubcategory`);
  }
  createcategory(subcategory, category) {
    let subcategoryarr = subcategory.split(',');
    console.log("subcategoryarr", subcategoryarr)
    let r = {
      "category": category,
      "subcategory": subcategoryarr
    }
    console.log("r", r)
    return this.http.post<User>(`${environment.apiUrl}/categorywithsubcategory`, r)

      .pipe(

        catchError((err) => this.handleError(err))
      );

  }
  handleError(errorObj: HttpErrorResponse): Observable<any> {
    console.log(errorObj);
    let errorMsg: any;
    console.log(errorObj);
    if (typeof errorObj.error === 'string') {
      errorMsg = errorObj.error;
    } else if (typeof errorObj.error === 'object' && errorObj.error != null) {
      if ('errors' in errorObj.error) {
        errorMsg = errorObj.error.errors[0].message;
      } else {
        errorMsg = errorObj.error.name;
      }
    } else {
      errorMsg = errorObj.message;
    }
    this.toastr.error(errorMsg, 'Error');
    return throwError(errorMsg);
  }
}
