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
import { EnumFakturaStatus } from "../common/model/faktura_status";
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { DownloadService } from '../common/services/download.service';
import { FormControl } from '@angular/forms';
import { Betalergruppe } from '../common/model/betalergruppe';

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
  }

  /**
   * Form control for the analyse autocomplete field
   */
  analyseControl = new FormControl();

  /**
   * List of analyse objects that gets filtered based on what the user types in the autocomplete field as the user types it
   */
  filteredFakturaer: Observable<Faktura[]>;

  /**
   * String controlling the view
   */
  view: string = "parses";
  views: string[] = ["parses", "betGrpInParse", "faktsInParse"]

  // status: string = "Alle";
  status: number = 0;
  // statuses: string[] = ["Alle", "Usendte", "Sendte", "Slettede"];

  parsetypes: string[] = ["Alle", "Labka", "Blodbank"];
  parsetypeToShow : string = "Alle";

  allParses: Parsing[];
  filteredParses: Parsing[];

  selectedFakturaer: Faktura[];
  selectedAnalyser: Analyse[];
  selectedParsing?: Parsing;

  parsingStartDate : Date;
  parsingEndDate   : Date;

  parsingSearchTerm: string;
  fakturaSearchTerm: string = "";

  // selectedParsingId: number;

  /**
   * Checks if the parse is of correct type, within the selected timeframe and contains the search term
   */
  parseSatisfiesSearch(parse : Parsing): Boolean {
    var typeCondition = (this.parsetypeToShow == "Alle") || (parse.ptype == this.parsetypeToShow);
    // var dateCondition = this.parseWithinDate(parse);
    var dateCondition = this.GenericWithinDate(parse.oprettet, this.parsingStartDate, this.parsingEndDate);
    if (!this.parsingSearchTerm) {
      var nameCondition = true
    } else {
      var nameCondition = (parse.filename.toLowerCase().includes(this.parsingSearchTerm.toLowerCase()))
    }
    return typeCondition && dateCondition && nameCondition
  }

  /**
   * Checks if faktura search term appears in faktura rekvirent, betalergrupper or EAN/GLN-number, or is null
   */
  fakturaSatisfiesSearch(faktura : Faktura): Boolean {
    // if (!this.fakturaSearchTerm) {
    //   return true
    // }
    var rekv = faktura.rekvirent;
    var term = this.fakturaSearchTerm.toLowerCase();

    var isInRekvirent = this.fakturaSearchTerm && rekv.afdelingsnavn.toLowerCase().includes(term);
    var isInBetalergruppe = rekv.betalergruppe && rekv.betalergruppe.navn.toLowerCase().includes(term);
    var isInEAN = String(rekv.GLN_nummer).includes(this.fakturaSearchTerm);
    var hasCorrectStatus = (this.status == 0) || (this.status == faktura.status);
    console.log(hasCorrectStatus);
    // var statcheck = faktura.status.
    return (isInRekvirent || isInBetalergruppe || isInEAN) && hasCorrectStatus
  }

  /**
   * Converts between statusnames specified in @this.statuses and opcodes used in the database
   */
  // statusNameToOpcode(statusName : string) : number {
  //   switch(statusName){
  //     case "Usendte": {
  //       return 10
  //     }
  //     case "Sendte": {
  //       return 20
  //     }
  //     case "Slettede": {
  //       return 30
  //     }
  //     default: {
  //       return 10
  //     }
  //   }
  // }

  /**
   * Returns true if the date of the parsing is after the selected startdate, or no startdate has been selected,
   * and vica-versa with enddate.
   */
  // parseWithinDate(parse : Parsing): Boolean {
  //   const pDate = new Date(parse.oprettet);
  //   const isAfter = (!(this.startDate) || (pDate >= this.startDate))
  //   const isBefore = (!(this.endDate) || (pDate <= this.endDate))
  //   return (isAfter && isBefore)
  // }

/**
 * Returns true if the date of the parsing is after the selected mindate, or no mindate has been selected,
 * and vica-versa with maxdate.
 */
  GenericWithinDate(itemDate : Date, minDate : Date, maxDate : Date): Boolean {
  var iDate = new Date(itemDate);
  var isAfter = (!(minDate) || (iDate >= minDate));
  var isBefore = (!(maxDate) || (iDate <= maxDate))
  return (isAfter && isBefore)
}

  getParsesNested(): void {
    this.parsingService.getAll(true).subscribe(allParses => this.allParses = allParses)
  }

  getSingleParseNested(id: number): void {
    this.parsingService.get(id, true).subscribe(selectedParsing => this.selectedParsing = selectedParsing)
    // this.parsingService.get()
  }

  getSingleParse(id: number): void {
    this.parsingService.get(id, false).subscribe(selectedParsing => this.selectedParsing = selectedParsing)
  }


  getParses(): void {
    this.parsingService.getAll(false).subscribe(allParses => this.allParses = allParses)
  }

  noop(id = 0): void {
    this.testtext = String(this.status)
  }

  writeBG(bg: Betalergruppe): void{
    this.testtext = "noopbg " + bg.navn
  }


  writeIDOfFakt(fakt: Faktura): void {
    this.testtext = String(fakt.id)
  }

  writeDateOfParse(parse: Parsing): void {
    const thisdate = new Date(parse.oprettet);
    this.testtext = String(thisdate)
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
    this.getSingleParseNested(parsing.id);
    // delete this.fakturaSearchTerm;
    this.fakturaSearchTerm = "";
    this.status = 0;
    this.view = "faktsInParse"
  }

  // onSelect(parsing: Parsing = this.selectedParsing): void {
    // this.selectedParsingId = parsing.id)
    // this.getSingleParseNested(parsing.id);
    // this.selectedParsing = parsing;
    // this.selectedFakturaer = parsing.fakturaer.filter((x: Faktura): boolean => { return x.status == (this.status as number); })
    // delete this.selectedFaktura;
    // delete this.selectedAnalyser
    // this.selectedFaktura = undefined;
    // this.selectedAnalyser = [] //!!!!!!
  // }

  // Denne bruges ikke atm
  // selectedFaktura?: Faktura;
  // onSelectF(faktura: Faktura): void {
  //   this.selectedFaktura = faktura;
  //   this.selectedAnalyser = faktura.analyser

  // }
}
