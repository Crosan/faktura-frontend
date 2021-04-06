/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { Betalergruppe } from '../model/betalergruppe';

@Injectable({
  providedIn: 'root'
})
export class BetalergruppeService extends DataService<Betalergruppe> {

  constructor(http: HttpClient) {
    super(http, 'betalergruppe');
  }

  handleResponse(data: any) {
    return plainToClass(Betalergruppe, data);
  }
}