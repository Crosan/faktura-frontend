import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppError } from '../common/error-handling/app-error';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { ParsingService } from '../common/services/parsing.service';
import { BetalergruppeService } from '../common/services/betalergruppe.service';
import { FakturaService } from '../common/services/faktura.service'
import { FakturaStatusService } from '../common/services/faktura_status.service'
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParseOptions } from 'querystring';
import { EnumFakturaStatus } from "../common/model/faktura_status";
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { DownloadService } from '../common/services/download.service';
import { FormControl } from '@angular/forms';
import { Parsing } from "../common/model/parsing";
import { Faktura } from '../common/model/faktura';
import { Analyse } from '../common/model/analyse';
import { Betalergruppe } from '../common/model/betalergruppe';
import { MatMenuModule } from '@angular/material/menu';
import { formatDate } from '@angular/common';
import { SendService } from '../common/services/send.service';
import { Rekvirent } from '../common/model/rekvirent';
import { DebitorDialogComponent } from '../rekvirenter/DebitorDialog/DebitorDialog.component';
import { DebitorService } from '../common/services/debitor.service';
import { MatDialog } from '@angular/material/dialog';
import { RekvirentService } from '../common/services/rekvirent.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyseTypeService } from '../common/services/analyse-type.service';
import { StatistikdialogComponent, statistikdialogData} from './statistikdialog/statistikdialog.component'


@Component({
  selector: 'app-parsing',
  templateUrl: './parsing.component.html',
  styleUrls: ['./parsing.component.css']
})
export class ParsingComponent implements OnInit {
  public config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right'
  });


  constructor(private toasterService: ToasterService,
    // private spinner: NgxSpinnerService,
    private parsingService: ParsingService,
    private betalergruppeService: BetalergruppeService,
    private fakturaService: FakturaService,
    private fakturaStatusService: FakturaStatusService,
    private sendService: SendService,
    private debitorService: DebitorService,
    private rekvirentService: RekvirentService,
    private analyseTypeService: AnalyseTypeService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private downloadService: DownloadService) { }

  ngOnInit() {
    this.getParses();
    // this.spinner.hide()
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
  views: string[] = ["parses", "betGrpInParse", "faktsInParse", "faktsInBtlgrpInParse"]

  spinnertext: string;

  status: number = 0;

  parsetypes: string[] = ["Alle", "Labka", "Blodbank"];
  parsetypeToShow: string = "Alle";

  allParses: Parsing[];
  filteredParses: Parsing[];

  selectedFakturaer: Faktura[];
  selectedAnalyser: Analyse[];
  selectedParsing?: Parsing;
  selectedBetalergruppe?: Betalergruppe;
  selectedBetalergrupper?: Betalergruppe[];

  parsingStartDate: Date;
  parsingEndDate: Date;

  parsingSearchTerm: string;
  fakturaSearchTerm: string = "";
  betalergrupppeSearchTerm: string = "";


  /**
   * Returns the creation date of the parsing formatted as 'yyyyMMddHHmmss' in Danish locale.
   */
  // timeFormat(parse: Parsing): string {
  //   // let ourTime = parse.oprettet.toDateString()
  //   let retval = formatDate(parse.oprettet, 'yyyyMMddHHmmss', 'DA-DK');
  //   // let retval = String(parse.oprettet.getFullYear()) + String(parse.oprettet.getMonth()) + String(parse.oprettet.getDate()) + String(parse.oprettet.getHours()) + String(parse.oprettet.getMinutes()) + String(parse.oprettet.getSeconds());    console.log(retval);
  //   console.log(retval);
  //   return retval
  // }

  /**
   * Conjugates the noun in either plural or singular 
   * @param count 
   * @param noun 
   * @param suffix 
   */
  plural(count, noun, suffix = 'r'): string {
    return `${noun}${count !== 1 ? suffix : ''}`;
  }

  /**
   * Determines whether the faktura satisfies conditions for sending,
   * i.e. being unsent, having a debitor and having a number of analyses
   * @param faktura 
   * @returns boolean
   */
  fakturaIsSendable(faktura: Faktura): boolean {
    if (!faktura.rekvirent.debitor_nr) {
      return false
    } else if (faktura.status != 10) {
      return false
    } else if (faktura.antal_analyser < 1) {
      return false
    } else {
      return true
    }
  }

  /**
   * Looks up if any debitors match the GLN/EAN number of the rekvirent, and adds them
   * as suggested debitors in the dialog. Updates rekvirent.debitor on return by 'Gem'.
   * @param rekvirent 
   */
  openDebitordialog(rekvirent: Rekvirent): void {
    let params = new Map();
    params.set('ean', rekvirent.GLN_nummer);
    this.debitorService.getAll(false, false, params).subscribe( foundDebitors => {
      let dialogData = {
        rekvirentName: rekvirent.shortname,
        debitorer: foundDebitors
      };
      this.dialog.open(DebitorDialogComponent, {height: '300px', width: '600px', data: dialogData}).afterClosed().toPromise().then(data => {
        if (!data) return
        else {
          let rekvirent_form = new FormData();
          rekvirent_form.append("id", rekvirent.id.toString());
          rekvirent_form.append("debitor_nr", data.response);
          this.rekvirentService.update(rekvirent_form, false).subscribe(response => {
            rekvirent.debitor_nr = data.response
          });
        }
      })
    })
      // let observables: Observable<void>[] = [];}
  }

  /**
   * Fetches statistics on the parameter faktura and opens the statistics dialogue
   * @param faktura 
   */
  openStatisticsdialog(faktura: Faktura): void {
    // console.log(faktura);
    let params = new Map();
    params.set('faktura', faktura.id);
    this.analyseTypeService.getAll(false, false, params).subscribe( analysetypes => {
      let dialogData = {
        rekvirentName: faktura.rekvirent.shortname,
        analysetyper: analysetypes,
        analyser: faktura.antal_analyser,
        cpr_numre: faktura.cpr,
      };
      this.dialog.open(StatistikdialogComponent, {height: '400px', width: '500px', data: dialogData})
    })
  }


  /**
   * Deletes the parsing from the database and removes it from the local list
   * @param parse The parsing object to delete
   */
  deleteParsing(parse: Parsing): void {
      if(confirm("Er du sikker? Dette kan ikke omgøres.")) {
        this.parsingService.delete(parse.id).subscribe( response => {
          this.allParses = this.allParses.filter(obj => obj !== parse);
        })
      }
  }

  /**
   * Sets the faktura status to 30 (slettet) in the database and on the local object
   * @param faktura 
   */
  deleteFaktura(faktura: Faktura): void{
    let faktura_form = new FormData();
    faktura_form.append("id", faktura.id.toString());
    faktura_form.append("status", '30');
    faktura_form.append("parsing", faktura.parsing.toString());
    this.fakturaService.update(faktura_form, false).subscribe(response => {
      faktura.status = 30;
      if (this.view == 'faktsInBtlgrpInParse') {
        this.selectedBetalergruppe.antal_unsent -= 1;
        this.selectedBetalergruppe.sum_unsent -= faktura.samlet_pris;
      }
    });
  }

  /**
   * Sets the faktura status to 10 (oprettet) in the database and on the local object
   * @param faktura 
   */
  unDeleteFaktura(faktura: Faktura): void{
    let faktura_form = new FormData();
    faktura_form.append("id", faktura.id.toString());
    faktura_form.append("status", '10');
    faktura_form.append("parsing", faktura.parsing.toString());
    this.fakturaService.update(faktura_form, false).subscribe(response => {
      faktura.status = 10;
      if (this.view == 'faktsInBtlgrpInParse') {
        this.selectedBetalergruppe.antal_unsent += 1;
        this.selectedBetalergruppe.sum_unsent += faktura.samlet_pris;
      }
    });
  }

  /**
   * Wraps the faktura ID in a list, and calls the API for sending the faktura.
   * @param fakt 
   */
  sendSingleFaktura(fakt: Faktura): void {
    this.sendService.newSend([fakt]).subscribe();
    if (this.selectedBetalergruppe) {
      if (this.view == 'faktsInBtlgrpInParse') {
        this.selectedBetalergruppe.sum_unsent -= fakt.samlet_pris;
        this.selectedBetalergruppe.antal_unsent -= 1;
      }
    }
  }

  /**
   * Fetches all the unsent and non-deleted fakturas in the current parsing, belonging
   * to the parameter betalergruppe and calls the API for sending them.
   * Updates local faktura objects for status and betalergruppe object for number and sum of unsent fakturas.
   * @param betalergruppe 
   */
  sendAllFakturasInBGInParse(betalergruppe: Betalergruppe): void {
    this.spinnertext = "Sender fakturaer"
    this.spinner.show();
    this.selectedFakturaer = [];
    let params = new Map();
    params.set('parsing', this.selectedParsing.id);
    params.set('betalergruppe', betalergruppe.id);
    // Fetch all fakturas for this betalergruppe in this parsing
    this.fakturaService.getAll(true, false, params).subscribe(returnedFakturaer => {
      // Remove fakturas with status 'sent' or 'deleted', with no analysis objects, or without debitor
      this.selectedFakturaer = returnedFakturaer.filter((item: Faktura) => (this.fakturaIsSendable(item)));
      
      if (this.selectedFakturaer.length > 0) {
        this.sendService.newSend(this.selectedFakturaer).subscribe( response => {
          if ((betalergruppe.antal_unsent - this.selectedFakturaer.length) > 0) {
            console.log('Ikke alle blev sendt');
            betalergruppe.antal_unsent -= this.selectedFakturaer.length;
            let sum: number = 0;
            this.selectedFakturaer.forEach(a => sum += a.samlet_pris);
            betalergruppe.sum_unsent -= sum
            let msg = this.plural(betalergruppe.antal_unsent, ' faktura', 'er')
            this.spinner.hide();
            this.toasterService.pop('failure', String(betalergruppe.antal_unsent) + msg + ' blev ikke sendt, check for korrekte debitorer');
          } else {
            console.log('Alle blev sendt, hurra');
            this.toasterService.pop('success', 'Alle fakturaer blev sendt');
            this.spinner.hide();
            betalergruppe.antal_unsent = 0;
            betalergruppe.sum_unsent = 0
          };
        });
      } else {
        console.log('Bah, empty');
        let diff = betalergruppe.antal_unsent;
        let msg = this.plural(diff, ' faktura', 'er');
        this.spinner.hide();
        this.toasterService.pop('failure', String(diff) + msg + ' blev ikke sendt, check for korrekte debitorer');
      }
    }
    )

  }

  /**
 * Downloads the mangelliste-file corresponding to the type and parsing
 */
  downloadFile(parse: Parsing, type: string) {
    let popup = window.open('', '_blank');

    // let path = "templates/" + this.template + "_template.xlsx";
    let path = "mangellister/" + parse.filename + "_-_"
      + formatDate(parse.oprettet, 'yyyyMMddHHmmss', 'Da-DK', "utc")
      + '_' + type + "_" + String(parse.id) + ".xlsx";
    console.log(path)
    // TODO: ASCII escape path

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

  /**
   * Checks if the parse is of correct type, within the selected timeframe and contains the search term
   */
  parseSatisfiesSearch(parse: Parsing): Boolean {
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
  fakturaSatisfiesSearch(faktura: Faktura): Boolean {
    // if (!this.fakturaSearchTerm) {
    //   return true
    // }
    var rekv = faktura.rekvirent;
    var term = this.fakturaSearchTerm.toLowerCase();

    var isInRekvirent = this.fakturaSearchTerm && rekv.shortname.toLowerCase().includes(term);
    var isInRekvNr = String(rekv.rekv_nr).toLowerCase().includes(term);
    var isInBetalergruppe = rekv.betalergruppe && rekv.betalergruppe.navn.toLowerCase().includes(term);
    var isInEAN = String(rekv.GLN_nummer).includes(term);
    var hasCorrectStatus = (this.status == 0) || (this.status == faktura.status);
    return (isInRekvirent || isInRekvNr || isInBetalergruppe || isInEAN) && hasCorrectStatus
  }

  betalergruppeSatisfiesSearch(betalergruppe: Betalergruppe): Boolean {
    var lc_searchterm = this.betalergrupppeSearchTerm.toLowerCase();
    var isInName = !(this.betalergrupppeSearchTerm) || String(betalergruppe.navn).toLowerCase().includes(lc_searchterm);
    var hasPrice = Boolean(betalergruppe.sum_total);
    return (isInName && hasPrice)
  }

  /**
   * Returns true if the date of the parsing is after the selected mindate, or no mindate has been selected,
   * and vica-versa with maxdate.
   */
  GenericWithinDate(itemDate: Date, minDate: Date, maxDate: Date): Boolean {
    var iDate = new Date(itemDate);
    var isAfter = (!(minDate) || (iDate >= minDate));
    var isBefore = (!(maxDate) || (iDate <= maxDate))
    return (isAfter && isBefore)
  }

  // updateParsing(parsing: Parsing): void{
  //   console.log(parsing);
  //   this.parsingService.update(parsing, true).subscribe()
  // }

  // getParsesNested(): void {
  //   this.parsingService.getAll(true).subscribe(allParses => this.allParses = allParses)
  // }

  /**
   * Fetches all fakturas in a parsing.
   * @param id The parsing ID
   */
  getSingleParseNested(id: number): void {
    let params = new Map();
    params.set('parsing', id);
    this.spinnertext = "Henter fakturaer"
    this.spinner.show();
    this.fakturaService.getAll(true, false, params).subscribe(selectedFakturaer => {
      this.selectedFakturaer = selectedFakturaer;
      this.spinner.hide()
    })
  }

  // getSingleParse(id: number): void {
  //   this.parsingService.get(id, false).subscribe(selectedParsing => this.selectedParsing = selectedParsing)
  // }

  /**
   * Fetches all betalergrupper with their statistics (number/sum of fakturas, sent/unsent) relating to the specifik parsing.
   * @param id The parsing ID
   */
  getBetalergrupper(id: number): void {
    let params = new Map();
    params.set('parsing', id);
    this.spinnertext = "Henter betalergrupper"
    this.spinner.show();
    this.betalergruppeService.getAll(false, false, params).subscribe(selectedBetalergrupper => {
      this.selectedBetalergrupper = selectedBetalergrupper;
      this.spinner.hide()
    })
  }

  /**
   * Fetches all fakturas belonging to the specified betalergruppe within the currently selected parsing (this.selectedParsing).
   * @param id The betalergruppe ID
   */
  getFaktsInBetgInParse(id: number): void {
    let params = new Map();
    params.set('parsing', this.selectedParsing.id);
    params.set('betalergruppe', id);
    this.spinnertext = "Henter fakturaer"
    this.spinner.show();
    this.fakturaService.getAll(true, false, params).subscribe(selectedFakturaer => {
      this.selectedFakturaer = selectedFakturaer;
      this.spinner.hide();
    })
  }

  /**
   * Fetches all parsings
   */
  getParses(): void {
    this.spinnertext = "Henter kørsler"
    this.spinner.show();
    this.parsingService.getAll(false).subscribe(allParses => {
      this.allParses = allParses;
      this.spinner.hide()
    })
  }

  /**
   * For debugging purposes. Console logs the thing.
   * @param thing 
   */
  noop(thing: any): void {
    console.log(thing)
  }

  // writeBG(bg: Betalergruppe): void{
  //   this.testtext = "noopbg " + bg.navn
  // }


  // writeIDOfFakt(fakt: Faktura): void {
  //   this.testtext = String(fakt.id)
  // }

  // writeDateOfParse(parse: Parsing): void {
  //   const thisdate = new Date(parse.oprettet);
  //   this.testtext = String(thisdate)
  // }

  // testtext = "init"

  /**
   * Downloads the file attached to the faktura object from the database
   */
  downloadMangelliste(parse: Parsing) {

    let popup = window.open('', '_blank');

    let path = parse.mangel_liste_fil
    // this.testtext = path
    this.downloadService.download(path).
      subscribe(file => {
        var url = window.URL.createObjectURL(file);
        popup.location.href = url;
        popup.focus();
        popup.onblur = function () { popup.close() };
      },
        (error: AppError) => {
          console.log("Error getting file", error);
          this.toasterService.pop('failure', 'Noget gik galt med download af filen.');
        }
      );
  }


  onSelectAlleFakturaer(parsing: Parsing): void {
    this.selectedParsing = parsing;
    this.selectedFakturaer = [];
    this.getSingleParseNested(parsing.id);
    // delete this.fakturaSearchTerm;
    this.fakturaSearchTerm = "";
    this.status = 0;
    this.view = "faktsInParse"
  }

  onSelectBetalergrupper(parsing: Parsing): void {
    this.selectedFakturaer = [];
    this.getBetalergrupper(parsing.id);
    this.selectedParsing = parsing;
    this.betalergrupppeSearchTerm = "";
    this.view = "betGrpInParse"
  }

  onSelectFaktsInBetalergruppe(betalergruppe: Betalergruppe): void {
    this.selectedFakturaer = [];
    this.getFaktsInBetgInParse(betalergruppe.id);
    this.selectedBetalergruppe = betalergruppe;
    this.fakturaSearchTerm = "";
    this.view = "faktsInBtlgrpInParse"
  }


}
