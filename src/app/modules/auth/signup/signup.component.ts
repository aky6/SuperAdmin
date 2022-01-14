import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../../shared/services/account.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService
  ) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      userName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      state: [''],
      zip: [''],
      city: [''],
      address: [''],
      mobileNumber: [''],
    });
    this.accountService.setHeaderDisplayStatus(true);
  }

  ngOnInit(): void {}

  get formControl() {
    return this.signUpForm.controls;
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      Object.keys(this.signUpForm.controls).forEach((key) => {
        this.signUpForm.get(key)?.markAsTouched();
      });
    } else if (
      this.formControl.password!.value !=
      this.formControl.confirmPassword!.value
    ) {
      this.formControl.confirmPassword!.setErrors({ incorrect: true });
    } else {
      this.accountService.register(this.signUpForm.value,'Vendor').subscribe(
        (response: any) => {
          this.toastr.success('Registration successful', 'Success!');
          this.router.navigateByUrl('/auth');
        },
        (err) => {
          if (err.status === 200) {
            this.toastr.success('Registration successful', 'Success!');
            this.router.navigateByUrl('/auth');
          }
        }
      );
    }
  }
}
