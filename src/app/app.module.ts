import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from 'src/interceptors/auth-intercepter.service';
import { JwtConfig, JwtModule } from '@auth0/angular-jwt';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeleteModalComponent } from './dashboard/delete-modal/delete-modal.component';
import { FormModalComponent } from './dashboard/form-modal/form-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// JWT config
const config: JwtConfig = {
  tokenGetter: () => localStorage.getItem('access_token'),
  headerName: 'Authorization',
  authScheme: 'Bearer ',
};

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    DeleteModalComponent,
    FormModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    ToastrModule.forRoot(),
    JwtModule.forRoot({ config }),
    NgbModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Added interceptor to providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
