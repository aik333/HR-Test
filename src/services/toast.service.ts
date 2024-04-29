import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastOptions = {
    timeOut: 5000, // Automatically clear toast after 2 seconds
    progressBar: true,
    positionClass: 'toast-bottom-right' // Customize position (optional)
  };
  private toastr =  inject(ToastrService);

  constructor() {}

  // Sucess Toaster
  success(message: string, title?: string) {
    this.toastr.success(message, title, this.toastOptions);
  }

  // Erro Toaster
  error(message: string, title?: string) {
    this.toastr.error(message, title, this.toastOptions);
  }

  // Info Toaster
  info(message: string, title?: string) {
    this.toastr.info(message, title, this.toastOptions);
  }

  // Warning Toaster
  warning(message: string, title?: string) {
    this.toastr.warning(message, title, this.toastOptions);
  }
}
