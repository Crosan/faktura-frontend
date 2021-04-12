import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppError } from '../common/error-handling/app-error';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { ParsingService } from '../common/services/parsing.service';
import { Parsing } from "../common/model/parsing";
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParseOptions } from 'querystring';
import { Faktura } from '../common/model/faktura';
import { Analyse } from '../common/model/analyse';
import { Rekvirent } from "../common/model/rekvirent";
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { DownloadService } from '../common/services/download.service';
import { FormControl } from '@angular/forms';
import { Betalergruppe } from '../common/model/betalergruppe';
import { RekvirentService } from '../common/services/rekvirent.service';

@Component({
  selector: 'app-parsing',
  templateUrl: './rekvirenter.component.html',
  styleUrls: ['./rekvirenter.component.css']
})
export class RekvirentComponent implements OnInit {

  constructor(private toasterService: ToasterService,
    // private spinner: NgxSpinnerService,
    private rekvirentService: RekvirentService,
    private downloadService: DownloadService) { }

  ngOnInit() {
    // this.spinner.show();
    // this.getParses();
  }

  searchTerm: string = "";

}
