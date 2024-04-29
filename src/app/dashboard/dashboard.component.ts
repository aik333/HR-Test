import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild, inject } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Employee } from 'src/models/employee.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { EmployeeService } from 'src/services/employee.service';
import { Subscription, catchError, of } from 'rxjs';
import { ToastService } from 'src/services/toast.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent {
  displayedColumns: string[] = ['name', 'salary', 'deductions', 'netSalary', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selectedEmployee!: Employee;

  // Injecting Required Fields
  private modalService = inject(NgbModal);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private viewportService = inject(BreakpointObserver);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  // to unsubscribe later
  subscribe = new Subscription()

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() { }


  ngOnInit() {
    // getting all employees when page is loaded
    this.getAllEmployees();
  }
  // Method to get all employees
  getAllEmployees() {
    this.subscribe.add(
      this.employeeService.getAllEmployees().pipe(
        catchError(err => {
          // toaster for error message
          this.toastService.error(err?.error?.message || 'Error', 'Failed!');
          return of({ message: 'Error retrieving data' });
        })
      ).subscribe(
        (res: any) => {
          // Handler Function to update data source
          this.updateDataSource(res);
        }
      )
    )
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // Helper function to sort the data
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Checkinng if the screen size is large or not
  isMobile() {
    return this.viewportService.isMatched(Breakpoints.Large);
  }

  // helper function to delete employee
  deleteEmployee(index: number) {
    this.selectedEmployee = this.dataSource.data[index];

    // Storing component Ref for future usage
    const componentRef = this.modalService.open(DeleteModalComponent); //Used NGB modal service for modals
    componentRef.componentInstance.employee = this.selectedEmployee;
    componentRef.result.then(
      res => {

        // To unsubscribe later
        this.subscribe.add(
          // Deletinnng a specific user on yes click
          this.employeeService.deleteEmployeeById(this.selectedEmployee.id || "").pipe(
            catchError(err => {

              // error toaster
              this.toastService.error(err?.error?.message || 'Error', 'Failed!');
              return of({ message: 'Error retrieving data' });
            })
          ).subscribe((res: any) => {
            if (res?.success) {

              // on success removinng user from data source
              this.dataSource.data.splice(index, 1);
              this.updateDataSource(this.dataSource.data);

              // success toaster
              this.toastService.success(res?.message, "Success");
            }
          })
        )
      }
    )

  }

  // Used a single function for both create and edit
  editEmployee(eventType: boolean, index: number = 0) {
    if (!eventType) {
      this.selectedEmployee = this.dataSource.data[index];
    }

    //Storing modal ref for future use
    const componentRef = this.modalService.open(FormModalComponent); //Used NGB Modal service for Modals

    // Passing required values to child componnents
    componentRef.componentInstance.employee = this.selectedEmployee;
    componentRef.componentInstance.isEditForm = !eventType;
    componentRef.result.then(
      res => {
        if (eventType) {

          // To unsubscribe later
          this.subscribe.add(
            
            // Create Employee Api call
            this.employeeService.createEmployee(res).pipe(
              catchError(err => {

                // error toaster
                this.toastService.error(err?.error?.message || 'Error', 'Failed!')
                return of({ message: 'Error retrieving data' });
              })
            ).subscribe((res: any) => {

              // Handling Success response
              this.dataSource.data.push(res['employee']);
              this.updateDataSource(this.dataSource.data);
              this.toastService.success(res?.message, "Success");
            })
          )
        } else {

          // To unsubscribe later
          this.subscribe.add(

            // Put Employee Api call to update employee
            this.employeeService.updateEmployeeById(this.selectedEmployee.id || '', res).pipe(
              catchError(err => {

                // error toaster
                this.toastService.error(err?.error?.message || 'Error', 'Failed!');
                return of({ message: 'Error retrieving data' });
              })
            ).subscribe((res: any) => {

              // Handling Success response
              this.dataSource.data[index] = res['employee'];
              this.updateDataSource(this.dataSource.data);
              this.toastService.success(res?.message, "Success");
            })
          )
        }

      }
    )
  }

  // Helper fuction to refresh data source
  updateDataSource(data: any) {
    this.dataSource = new MatTableDataSource<any>(data); // Refresh data source
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  // On Destroy unsubscribed to all API's
  ngOnDestroy(): void {
    if (this.subscribe) this.subscribe.unsubscribe()
  }
}

