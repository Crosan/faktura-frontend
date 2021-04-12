/**
 * @module Services
 */

 import { Injectable } from '@angular/core';
 import { DataService } from './data.service';
 import { HttpClient } from '@angular/common/http';
 import { plainToClass } from 'class-transformer';
 import { Rekvirent } from '../model/rekvirent';
 
 @Injectable({
   providedIn: 'root'
 })
 export class RekvirentService extends DataService<Rekvirent> {
 
   constructor(http: HttpClient) {
     super(http, 'rekvirent');
   }
 
   handleResponse(data: any) {
     return plainToClass(Rekvirent, data);
   }
 }