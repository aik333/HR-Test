import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from 'src/models/employee.model';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {

  @Input() employee!: Employee
  private modal = inject(NgbActiveModal);


  // Event Handler Functio
  hadleEvent(isDelete?: boolean) {
    if (isDelete) {
      this.modal.close();
    } else {
      this.modal.dismiss();
    }
  }
}
