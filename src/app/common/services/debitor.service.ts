/**
 * @module Services
 */

 import { Injectable } from '@angular/core';
 import { DataService } from './data.service';
 import { HttpClient } from '@angular/common/http';
 import { plainToClass } from 'class-transformer';
 import { Debitor } from '../model/debitor';
 
 @Injectable({
   providedIn: 'root'
 })
 export class DebitorService extends DataService<Debitor> {
 
   constructor(http: HttpClient) {
     super(http, 'debitor');
   }
 
   handleResponse(data: any) {
     return plainToClass(Debitor, data);
   }
 }