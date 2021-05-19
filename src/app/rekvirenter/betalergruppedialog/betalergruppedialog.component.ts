import { Component, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Betalergruppe } from '../../common/model/betalergruppe';

/**
 * Interface used for sending data to the betalergruppedialogComponent
 */
export interface betalergruppedialogData {
  /**
   * The title shown at the top
   */
  rekvirentName: string
  betalergrupper: Betalergruppe[]
}

/**
 */
@Component({
  selector: 'app-betalergruppedialog',
  templateUrl: './betalergruppedialog.component.html',
  styleUrls: ['./betalergruppedialog.component.css']
})
export class BetalergruppedialogComponent {
  // myControl = new FormControl();
  /**
   * The title shown at the top
   */
   rekvirentName: string;

  betalergrupper: Betalergruppe[]

  selected: number;

  constructor(public dialogRef: MatDialogRef<BetalergruppedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: betalergruppedialogData) {
    this.rekvirentName = data.rekvirentName;
    this.betalergrupper = data.betalergrupper
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
    this.dialogRef.close({ response: this.selected });
  }

  /**
   * Set the selected options when the user clicks something in the selection list
   * @param e The event from the mat-selection-list
   */
//   onSelection(e) {
//     this.selections = e
//   }
}