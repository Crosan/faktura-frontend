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

  statuses: number[] = [10, 20, 30];
  status: number = 10;

  parsetypes: string[] = ["Labka", "Blodbank"];
  parseTypeToShow : string = "Labka";

  allParses: Parsing[];
  filteredParses: Parsing[];

  selectedFakturaer: Faktura[];
  selectedAnalyser: Analyse[];
  selectedParsing?: Parsing;

  startDate: Date;
  endDate: Date;

  // selectedParsingId: number;

  /**
   * Checks if the parse is of correct type, and within the selected timeframe
   */
  parseSatisfiesSearch(parse : Parsing): Boolean {
    const typeCondition = parse.ptype == this.parseTypeToShow;
    const dateCondition = this.parseWithinDate(parse)
    // const nameCondition = 
    return typeCondition && dateCondition
  }

  /**
   * Returns true if the date of the parsing is after the selected startdate, or no startdate has been selected,
   * and vica-versa with enddate.
   */
  parseWithinDate(parse : Parsing): Boolean {
    const isAfter = (!(this.startDate) || (true)) //TODO
    const isBefore = (!(this.endDate) || (true))
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
    // this.testtext = "Noop " + String(this.allParses.length)
    // this.filteredParses = this.allParses.filter((x: Parsing): boolean => { return (x.oprettet.getTime() >= 1616194800); }) // (x.oprettet.getTime() >= this.startDate.getTime() || (x.oprettet.getTime() <= this.endDate.getTime()
    // this.testtext = String(this.filteredParses.length)
    // this.testtext = "noop0 " + String(id);
    // this.testtext = "noop1 " + String(this.allParses[id].oprettet)
    this.testtext = "noop2 " + String(this.selectedParsing.oprettet.getDate)
  }

  writeBG(bg: Betalergruppe): void{
    this.testtext = "noopbg " + bg.navn
  }


  writeIDOfFakt(fakt: Faktura): void {
    this.testtext = String(fakt.id)
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

  // Denne bruges ikke atm
  selectedFaktura?: Faktura;
  onSelectF(faktura: Faktura): void {
    this.selectedFaktura = faktura;
    this.selectedAnalyser = faktura.analyser

  }
}

(x: Faktura): boolean => { return x.status == 10; }