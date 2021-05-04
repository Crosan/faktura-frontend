import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * Interface used for sending data to the EANdialogComponent
 */
export interface EANdialogData {
  /**
   * The title shown at the top
   */
  rekvirentName: string
}

/**
 * This component is a generic dialog component where the title, subtitle and user options can be specified dynamically
 */
@Component({
  selector: 'app-EANdialog',
  templateUrl: './EANdialog.component.html',
  styleUrls: ['./EANdialog.component.css']
})
export class EANdialogComponent {
  /**
   * The title shown at the top
   */
   rekvirentName: string;
  /**
   * A subtext shown below the title
   */
  EANresponse: string;

  constructor(public dialogRef: MatDialogRef<EANdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EANdialogData) {
    this.rekvirentName = data.rekvirentName
  }

  /**
   * Close the dialog and do nothing
   */
  annuller(): void {
    this.dialogRef.close();
  }

  /**
   * Close the dialog and send back selection data
   */
  ok() {
    this.dialogRef.close({ response: this.EANresponse });
  }

  /**
   * Set the selected options when the user clicks something in the selection list
   * @param e The event from the mat-selection-list
   */
//   onSelection(e) {
//     this.selections = e
//   }
}