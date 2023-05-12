import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Conference } from './model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public getConferences$: Subject<Conference[]> = new Subject();
  public setConferences$: Subject<unknown> = new Subject();

  public getConferences(): void {
    const confs = localStorage.getItem('conferences');
    if (confs) {
      this.getConferences$.next(JSON.parse(confs));
    } else {
      this.getConferences$.next([]);
    }
  }

  public setConferences(conferences: Conference[]): void {
    const confs = localStorage.getItem('conferences');
    if (confs) {
      localStorage.removeItem('conferences');
    }
    try {
      localStorage.setItem('conferences', JSON.stringify(conferences));
      this.setConferences$.next(true);
    } catch (err) {
      this.setConferences$.error(err);
    }
  }
}
