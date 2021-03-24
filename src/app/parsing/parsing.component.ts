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

@Component({
  selector: 'app-parsing',
  templateUrl: './parsing.component.html',
  styleUrls: ['./parsing.component.css']
})
export class ParsingComponent implements OnInit {

  constructor(private toasterService: ToasterService,
    private parsingService: ParsingService) { }

  ngOnInit() {
    this.getParses();
    // this.selectedParsing = this.allParses[0]
  }

  statuses: number[] = [10, 20, 30];
  status: number = 10;

  allParses: Parsing[];

  selectedFakturaer: Faktura[];
  selectedAnalyser: Analyse[];

  getParses(): void {
    this.parsingService.getAll(true).subscribe(allParses => this.allParses = allParses)
  }

  selectedParsing?: Parsing;
  onSelect(parsing: Parsing = this.selectedParsing): void {
    this.selectedParsing = parsing;
    this.selectedFakturaer = parsing.fakturaer.filter((x: Faktura): boolean => { return x.status == (this.status as number); })
    // delete this.selectedFaktura;
    // delete this.selectedAnalyser
    this.selectedFaktura = undefined;
    this.selectedAnalyser = [] //!!!!!!
  }
  selectedFaktura?: Faktura;
  onSelectF(faktura: Faktura): void {
    this.selectedFaktura = faktura;
    this.selectedAnalyser = faktura.analyser

  }
}

(x: Faktura): boolean => { return x.status == 10; }