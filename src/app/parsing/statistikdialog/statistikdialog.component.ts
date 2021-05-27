import { Component, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnalyseType } from 'src/app/common/model/analyse-type';

/**
 * Interface used for sending data to the dialogComponent
 */
export interface statistikdialogData {
  rekvirentName: string
  analyser: number,
  cpr_numre: number,
  analysetyper: AnalyseType[]
}


@Component({
  selector: 'app-statistikdialog',
  templateUrl: './statistikdialog.component.html',
  styleUrls: ['./statistikdialog.component.css'],
})
export class StatistikdialogComponent {

  rekvirentName: string;
  analyser: number;
  cpr_numre: number;
  analysetyper: AnalyseType[];

  constructor(public dialogRef: MatDialogRef<StatistikdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: statistikdialogData) {
    this.rekvirentName = data.rekvirentName;
    this.analyser = data.analyser;
    this.cpr_numre = data.cpr_numre;
    this.analysetyper = data.analysetyper
  }

  /**
   * Close the dialog and do nothing
   */
  annuller(): void {
    this.dialogRef.close();
  }

  /**
   * Close the dialog
   */
  ok() {
    this.dialogRef.close();
  }

  /**
   * Set the selected options when the user clicks something in the selection list
   * @param e The event from the mat-selection-list
   */
  //   onSelection(e) {
  //     this.selections = e
  //   }
}