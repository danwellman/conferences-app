import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Conference } from '../model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  protected confs: Conference[] = [];

  private subs: Subscription[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  public ngOnInit(): void {
    this.subs.push(
      this.dataService.getConferences$.subscribe((conferences: Conference[]) => {
        this.confs = conferences;
      })
    );
    this.dataService.getConferences();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public addConference(): void {
    this.router.navigateByUrl('/add');
  }
}
