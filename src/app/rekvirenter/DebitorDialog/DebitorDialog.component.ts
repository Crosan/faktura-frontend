import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Debitor } from 'src/app/common/model/debitor';
import { DebitorService } from 'src/app/common/services/debitor.service';

/**
 * Interface used for sending data to the EANdialogComponent
 */
export interface DebitorDialogData {
  debitorer: Debitor[];
  /**
   * The title shown at the top
   */
  rekvirentName: string
}

/**
 * This component is a generic dialog component where the title, subtitle and user options can be specified dynamically
 */
@Component({
  selector: 'app-DebitorDialog',
  templateUrl: './DebitorDialog.component.html',
  styleUrls: ['./DebitorDialog.component.css']
})
export class DebitorDialogComponent {
  /**
   * The title shown at the top
   */
  rekvirentName: string;
  DebitorResponse: string;
  test: any;
  debitorer: Debitor[];

  constructor(public dialogRef: MatDialogRef<DebitorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DebitorDialogData) {
    this.rekvirentName = data.rekvirentName,
    this.debitorer = data.debitorer;
  }

  /**
   * Close the dialog and do nothing
   */
  annuller(): void {
    this.dialogRef.close();
  }

  printTest(): void{
    console.log(this.DebitorResponse)
  }

  /**
   * Close the dialog and send back selection data
   */
  ok() {
    this.dialogRef.close({ response: this.DebitorResponse });
  }

  /**
   * Set the selected options when the user clicks something in the selection list
   * @param e The event from the mat-selection-list
   */
//   onSelection(e) {
//     this.selections = e
//   }
}