import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppError } from '../common/error-handling/app-error';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { ParsingService } from '../common/services/parsing.service';
import { Parsing } from "../common/model/parsing";
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParseOptions } from 'querystring';
import { Faktura } from '../common/model/faktura';

@Component({
  selector: 'app-parsing',
  templateUrl: './parsing.component.html',
  styleUrls: ['./parsing.component.css']
})
export class ParsingComponent implements OnInit {

  constructor(private toasterService: ToasterService,
    private parsingService: ParsingService) { }

  ngOnInit() {
    console.log("logbesked");
    this.getParses();
    this.testParse = this.allParses[3]
    // console.log("test")
  }


  allParses: Parsing[];

  testParse: Parsing;

  selectedFakturaer: Faktura[];

  getParses(): void {
    this.parsingService.getAll(true).subscribe(allParses => this.allParses = allParses)
  }

  selectedParsing?: Parsing;
  onSelect(parsing: Parsing): void {
    this.selectedParsing = parsing;
    this.selectedFakturaer = parsing.fakturaer
}
}