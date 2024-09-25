import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HeaderService {

  private _wpBase = environment.wpBase + '';

  constructor(private http: HttpClient) { }

  /**
    * @returns Titulo de la Pagina Web
    */
  getTitleWebPage(): Observable<any> {
    return this.http.get<any>(this._wpBase + '');
  }

  /**
    * @returns Menu items
    */
  getMenu(): Observable<any> {
    return this.http.get(this._wpBase + 'wp-api-menus/v2/menus')
      .pipe(
        tap((res: any) => {
          // You can handle the response here if needed
          return res;
        })
      );

  }

  /**
   * @returns Menu items por id
   */
  getMenubyID(id: String): Observable<any> {
    return this.http.get<any>(this._wpBase + `wp-api-menus/v2/menus/${id}`);
  }

}
