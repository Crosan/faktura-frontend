/**
 * @module Services
 */

 import { Injectable } from '@angular/core';
 import { DataService } from './data.service';
 import { HttpClient } from '@angular/common/http';
 import { plainToClass } from 'class-transformer';
//  import { Faktura } from '../model/faktura';
import { FakturaStatus } from '../model/faktura_status';
 
 @Injectable({
   providedIn: 'root'
 })
 export class FakturaStatusService extends DataService<FakturaStatus> {
 
   constructor(http: HttpClient) {
     super(http, 'faktura-status');
   }
 
   handleResponse(data: any) {
     return plainToClass(FakturaStatus, data);
   }
 }