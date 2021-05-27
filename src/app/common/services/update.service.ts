/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';
import { Faktura } from '../model/faktura';
import { Parsing } from '../model/parsing';
// import { Faktura } from ''

@Injectable()
export class UpdateService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url + "/" + "rerun-mangelliste/"
  }

  /**
   * Does stuff
   * @param fakts array of fakturas to send
   * @returns Observable<any>
   */
  rerun(parsing: Parsing): Observable<any> {
    let params = new HttpParams();
    params = params.append("parsing", parsing.id.toString());

    const options = {
      params: params,
      responseType: "blob" as "blob"
    };
    console.log(options);
    return this.http.get(this.url, options)
  }
}