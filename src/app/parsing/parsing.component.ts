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
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { DownloadService } from '../common/services/download.service';

@Component({
  selector: 'app-parsing',
  templateUrl: './parsing.component.html',
  styleUrls: ['./parsing.component.css']
})
export class ParsingComponent implements OnInit {

  constructor(private toasterService: ToasterService,
    // private spinner: NgxSpinnerService,
    private parsingService: ParsingService,
    private downloadService: DownloadService) { }

  ngOnInit() {
    // this.spinner.show();
    this.getParses();
    // this.selectedParsing = this.allParses[0]
  }

  /**
 * String controlling the view
 */
  view: string = "parses";
  views: string[] = ["parses", "betGrpInParse", "faktsInParse"]

  statuses: number[] = [10, 20, 30];
  status: number = 10;

  allParses: Parsing[];

  selectedFakturaer: Faktura[];
  selectedAnalyser: Analyse[];
  selectedParsing?: Parsing;

  // selectedParsingId: number;

  getParsesNested(): void {
    this.parsingService.getAll(true).subscribe(allParses => this.allParses = allParses)
  }

  getSingleParseNested(id : number): void{
    this.parsingService.get(id, true).subscribe(selectedParsing => this.selectedParsing = selectedParsing)
    // this.parsingService.get()
  }

  getSingleParse(id : number) : void {
    this.parsingService
  }
  

  getParses(): void {
    this.parsingService.getAll(false).subscribe(allParses => this.allParses = allParses)
  }

  noop(): void {

  }

  testtext = "init"

  /**
* Downloads the file attached to the faktura object from the database
*/
  downloadMangelliste(parse: Parsing) {

    let popup = window.open('', '_blank');

    let path = parse.mangel_liste_fil
    this.testtext = path
    this.downloadService.download(path).
      subscribe(file => {
        var url = window.URL.createObjectURL(file);
        popup.location.href = url;
        popup.focus();
        popup.onblur = function () { popup.close() };
      },
        (error: AppError) => {
          console.log("Error getting file", error)
        }
      );
  }


  onSelectAlleFakturaer(parsing: Parsing): void {
    this.getSingleParseNested(parsing.id)
    this.view = "faktsInParse"
    this.testtext = String(this.selectedParsing.fakturaer.length) 
  }
  
  onSelect(parsing: Parsing = this.selectedParsing): void {
    // this.selectedParsingId = parsing.id)
    this.getSingleParseNested(parsing.id);
    // this.selectedParsing = parsing;
    // this.selectedFakturaer = parsing.fakturaer.filter((x: Faktura): boolean => { return x.status == (this.status as number); })
    // delete this.selectedFaktura;
    // delete this.selectedAnalyser
    // this.selectedFaktura = undefined;
    // this.selectedAnalyser = [] //!!!!!!
  }
  selectedFaktura?: Faktura;
  onSelectF(faktura: Faktura): void {
    this.selectedFaktura = faktura;
    this.selectedAnalyser = faktura.analyser

  }
}

(x: Faktura): boolean => { return x.status == 10; }