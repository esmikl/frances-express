import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Contact} from "./contact";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
    errorMessage!: string;
    data!: any;

    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})
    };

    constructor(private http: HttpClient) {}

    getData(): Observable<any> {
        return this.http.get('/api/contact_form.php');
    }

    contactForm(formdata: Contact): Observable<any> {
      return this.http.post<Contact>('/api/contact_form.php',
        formdata, this.httpOptions).pipe(catchError(this.handleError));
    }

    private handleError() {
        this.errorMessage = 'Oops! Something went wrong. Please call 715-568-2211.';
        return throwError(this.errorMessage);
    }
}
