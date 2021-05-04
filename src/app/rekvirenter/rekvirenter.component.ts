import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AppError } from '../common/error-handling/app-error';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { ParsingService } from '../common/services/parsing.service';
import { Parsing } from "../common/model/parsing";
import { Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ParseOptions } from 'querystring';
import { Faktura } from '../common/model/faktura';
import { Analyse } from '../common/model/analyse';
import { Rekvirent } from "../common/model/rekvirent";
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { DownloadService } from '../common/services/download.service';
import { FormControl } from '@angular/forms';
import { Betalergruppe } from '../common/model/betalergruppe';
import { RekvirentService } from '../common/services/rekvirent.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { UpdateEANDialogData, UpdateEANDialog } from './EANdialog/EANdialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';



export interface DialogData {
  rekvirentName: string;
  // rekvirentEAN : string;
}


@Component({
  selector: 'app-parsing',
  templateUrl: './rekvirenter.component.html',
  styleUrls: ['./rekvirenter.component.css']
})
export class RekvirentComponent implements OnInit {

  // EANdialogRef: MatDialogRef<EANdialogComponent>;

  constructor(private toasterService: ToasterService,
    // private spinner: NgxSpinnerService,
    private rekvirentService: RekvirentService,
    public dialog: MatDialog,
    private downloadService: DownloadService) { }


  selectedEAN?: String;
  /**
   * List of all rekvirent-objects that are relevant for this component
   */
   rekvirenter: Rekvirent[] = [];

  /**
   * Form control for the rekvirent autocomplete field
   */
  rekvirentControl = new FormControl();

  /**
   * List of rekvirent objects that gets filtered based on what the user types in the autocomplete field as the user types it
   */
  filteredRekvirenter: Observable<Rekvirent[]>;


  ngOnInit() {
    // this.spinner.show();
    // this.getParses();
    this.getData()
  } 

  searchTerm: string = "";

  getData() {
    this.rekvirentService.getAll(false, true).subscribe(allParses => this.rekvirenter = allParses);
    this.filteredRekvirenter = this.rekvirentControl.valueChanges.pipe(startWith(""),map((a) => (a ? this._filterAnalyser(a) : this.rekvirenter))
    );
  }

  openDialog(rekvirent: Rekvirent): void {
    const dialogRef = this.dialog.open(EANdialog, {
      height: '400px',
      width: '250px',
      // data: {name: this.name, animal: this.animal}
      data: {rekvirentName: rekvirent.shortname}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.selectedEAN = result;
    });
  }


  /**
   * This function filters rekvirent objects based on their name, EAN-number, betalergruppe or number.
   * It takes a string input and only returns the objects whose value at least partially matches the input value.
   * @param value The string value from the textbox used to filter the list
   */
   private _filterAnalyser(value: string): Rekvirent[] {
    if (!value.toLowerCase) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.rekvirenter.filter(
      (a) =>
        (a.shortname.toLowerCase().includes(filterValue)) ||
        // (a.shortname.toLowerCase().indexOf(filterValue) !== 1) ||
        (a.GLN_nummer    && (a.GLN_nummer.toString().toLowerCase().includes(filterValue))) ||
        (a.betalergruppe && (a.betalergruppe.navn.toLowerCase().includes(filterValue))) ||
        (a.rekv_nr       && (a.rekv_nr.toString().toLowerCase().includes(filterValue)) )

        // (a.betalergruppe.navn.toLowerCase().indexOf(filterValue) !== 1) ||
        // (a.rekv_nr.toString().toLowerCase().indexOf(filterValue) !== 1)


        // a.undersogelse.glas_Nr.toString().toLowerCase().indexOf(filterValue) !==
        // -1 ||
        // (a.pool_nummer &&
        //   a.pool_nummer.toString().toLowerCase().indexOf(filterValue) !== -1) ||
        // a.undersogelse.rekvisitioner[
        //   a.undersogelse.rekvisitioner.length - 1
        // ].patient.CPR.toString()
        //   .toLowerCase()
        //   .indexOf(filterValue) !== -1 ||
        // a.status === EnumAnalyseStatus.afvist ||
        // (a.status === EnumAnalyseStatus.data_analysis_done &&
        //   a.pakke.kort_navn.toString().toLowerCase().indexOf(filterValue) !==
        //   -1)
    );
  }
}


@Component({
  selector: 'app-parsing',
  templateUrl: './EANdialog/EANdialog.component.html',
  styleUrls: ['./rekvirenter.component.css']
})
export class EANdialog {

  constructor(
    public dialogRef: MatDialogRef<EANdialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}