import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
   url = 'http://localhost:3003';
 
  constructor(
    private httpClient: HttpClient
  ) {}
/*   setDataOnLocal(keyName: string, data: any) {
    localStorage.setItem(keyName, JSON.stringify(data));
  }

  getDataFromLocal(keyName: string) {
    return JSON.parse(localStorage.getItem(keyName));
  }

  clearDataFromLocal(keyName: string) {
    localStorage.removeItem(keyName);
  } */

  removeAllLocalData() {
    localStorage.clear();
  }
  

  getJsonList() {
    return this.httpClient
      .get(this.url +'/api/listFiles')
      .pipe(
        map(response => {
          return response;
        }),

        catchError(error => {
          return of(error);
        })
      );
  }

  getFile(file:string) {
    return this.httpClient
      .get(`${this.url}/api/getData/${file}`)
      .pipe(
        map(response => {
          return response;
        }),

        catchError(error => {
          return of(error);
        })
      );
  }

  
}
