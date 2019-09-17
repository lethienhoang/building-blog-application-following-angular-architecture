import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { ErrorResponse } from 'src/app/interfaces/error';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


  tryParseError(error: Response): any {
    try {
      return error.json().error;
    } catch (ex) {
      try {
        return error;
      } catch (ex) {
        return error.toString();
      }
    }
  }

  parseCustomServerErrorToString(error: ErrorResponse): string {
    const parsedError = this.createCustomError(error);
    try {
      return JSON.stringify(this.tryParseError(parsedError));
    } catch (ex) {
      try {
        return error.error.toString();
      } catch (error) {
        return error.toString();
      }
    }
  }



  parseCustomServerError(error: ErrorResponse): any {
    const title = error.message;
    let body = '';
    for (const errorMsg of error.error) {
      body += `${errorMsg}. `;
    }


    return { title, body };
  }


  createCustomError(error: ErrorResponse): Response {
    try {
      const parsedError = this.parseCustomServerError(error);
      const responseOptions = new ResponseOptions({
        body: { error: { title: parsedError.title, message: parsedError.body } },
        status: 400,
        headers: null,
        url: null
        
      });

      return new Response(responseOptions);
      
    } catch(ex) {
      const responseOptions = new ResponseOptions({
        body: { title: 'Unknown Error!', message: 'Unknown Error Occurred.' },
        status: 400,
        headers: null,
        url: null,
      })
    }
  }
}
