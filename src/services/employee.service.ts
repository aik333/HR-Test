import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Employee } from 'src/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  path: string = 'employees';
  server_url = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  // Create New Employee
  createEmployee(employee: Employee) {
    return this.http.post(this.server_url + this.path, employee);
  }

  // Get All Employees
  getAllEmployees(){
    return this.http.get(this.server_url+this.path);
  }

  // Get Employee By Id
  getEmployeeById(empId:string){
    return this.http.get(this.server_url+this.path+`/${empId}`);
  }

  // Delete Employee By Id
  deleteEmployeeById(empId:string){
    return this.http.delete(this.server_url+this.path+`/${empId}`);
  }

  // Delete Employee By Id
  updateEmployeeById(empId:string,body:Employee){
    return this.http.put(this.server_url+this.path+`/${empId}`,body);
  }

}
