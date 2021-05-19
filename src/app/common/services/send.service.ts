/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';
import { Faktura } from '../model/faktura';
// import { Faktura } from ''

@Injectable()
export class SendService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url + "/" + "send/"
  }

  send(): Observable<any> {
    let headers = {}
    let token = localStorage.getItem('token')
    headers['Authorization'] = token

    const options = {
      headers: headers
    };

    return this.http.get(this.url, options)
  }

  /**
   * Does stuff
   * @param fakts array of fakturas to send
   * @returns Observable<any>
   */
  newSend(fakts: Faktura[]): Observable<any> {
    let headers = {}
    let token = localStorage.getItem('token')
    headers['Authorization'] = token

    // let paramString = "";
    let ids = [];

    var f: any;
    // for (f in fakts){
    //   paramString += f.id;
    //   console.log(f);
    // } 
    fakts.forEach(element => {
      if (element.status == 10) {
        ids.push(element.id);
        element.status = 20
      }
    });
    if (ids.length == 0){
      return
    };   
    
    let paramString = ids.join(',');
    console.log(paramString);
    // return
    let params = new HttpParams();
    params = params.append("faktura", paramString);

    const options = {
      params: params,
      // responseType: "blob" as "blob"
    };
    return this.http.get(this.url, options)
  }
}