import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from 'src/models/employee.model';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent {
  // Inputs from parent
  @Input() isEditForm: boolean = false;
  @Input() employee!: Employee;

  // Required Service File innjections
  private modal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);

  employeeForm: FormGroup = new FormGroup({});
  constructor() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      salary: [null, [Validators.required]],
      deductions: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    // Attaching values incase of edit
    if (this.employee && this.isEditForm) {
      this.employeeForm.patchValue(this.employee);
    }
  }
  hadleEvent() {
    // Passing values to parent on submit click
    this.modal.close(this.employeeForm.value);
  }
  closeModal() {
    this.modal.dismiss();
  }
}
