import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { Subscription, catchError, of } from 'rxjs';
import { ToastService } from 'src/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  authForm: FormGroup = new FormGroup({});
  isSignUp: boolean = true;
  submitClicked: boolean = false;
  minPasswordLength: number = 8;

  // Injecting required services
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // to unsubscribe later
  subscribe = new Subscription()

  constructor() { }

  ngOnInit() {
    const user = this.authService.getUser();
    const token = localStorage.getItem('access_token') || '';
    if (user && !this.authService.verifyJWT(token)) this.router.navigateByUrl('/');

    //Creating auth Form
    this.authForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.minPasswordLength)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  // Handle Submit 
  onSubmit() {
    this.submitClicked = true;
    let { name, email, password } = this.authForm.value;

    // If it is Signup mode
    if (this.authForm.valid && this.isSignUp) {
      // will be unsubscibed on destroy
      this.subscribe.add(
        this.authService.signUp({
          name: name,
          email: email,
          password: password
        }).pipe(
          catchError(err => {
  
            // Toatster for Error
            this.toastService.error(err?.error?.message || 'Error', 'Failed!');
            return of({ message: 'Error retrieving data' });
          })
        ).subscribe((res: any) => {
          if (res.user && res.token) {
  
            // Helper Function for Code Reuse Ability
            this.handleSuccess(res);
          }
        })
      )
      // If it is Login mode
    } else if (email.length && password.length >= this.minPasswordLength && !this.isSignUp) {

      // will be unsubscibed on destroy
      this.subscribe.add(
        this.authService.login({
          email: email,
          password: password
        }).pipe(
          catchError(err => {
  
            // Toatster for Error
            this.toastService.error(err?.error?.message || 'Error', 'Failed!');
            return of({ message: 'Error retrieving data' });
          })
        ).subscribe((res: any) => {
          if (res.user && res.token) {
            this.handleSuccess(res);
          }
        })
      );
    }
  }

  // A function to change the Auth Mode
  authModeSwitch() {
    this.isSignUp = !this.isSignUp;
    if (!this.isSignUp) {

      // Removing controls for login mode
      this.authForm.removeControl('name');
      this.authForm.removeControl('confirmPassword');
    } else {

      // Adding controls for signup mode
      this.authForm.addControl('name', new FormControl(['', Validators.required]));
      this.authForm.addControl('confirmPassword', new FormControl(['', Validators.required]));
    }

    // Reseting auth form values on mod switch
    this.authForm.reset();
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: FormGroup) {
    const password = control.value['password'];
    const confirmPassword = control.value['confirmPassword'];
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  // Helper fuction to handle Sucess Response of Auth Api's
  handleSuccess(res: any) {
    localStorage.setItem('access_token', res.token);
    localStorage.setItem('hrUser', JSON.stringify(res.user));
    this.router.navigateByUrl('/');

    // Toatster for Sucess
    this.toastService.success(res.message, "Success");
  }

  // On Destroy unsubscribed to all API's
  ngOnDestroy(): void {
    if(this.subscribe) this.subscribe.unsubscribe()
  }
}
