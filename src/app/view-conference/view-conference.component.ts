import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { differenceInCalendarDays } from 'date-fns';

import { Conference } from '../model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-view-conference',
  templateUrl: './view-conference.component.html',
  styleUrls: ['./view-conference.component.scss']
})
export class ViewConferenceComponent implements OnInit {
  protected confs: Conference[] = [];
  protected conf: Conference = {} as unknown as Conference;
  protected days = 0;

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    ) {
    // this.confs.push({
    //   id: 1,
    //   title: 'TypeScript Conference',
    //   startDateTime: '2024-05-04T09:00:00Z',
    //   endDateTime: '2024-05-05T17:00:00Z',
    //   description: 'A fun-filled weekend of pure TypeScript...',
    //   // logo: {
    //   //   src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAolBMVEUAAAAxeMYwd8UwcM8weMUwd8cweccweMQwd78yeMcxecUwd8Uxd8UxecYxeMUwcL9+q9t+qtxXktDm7veYu+PY5fWyzOlxothlmdRYkdBLiM2+1e1yodjZ5vS/1ezL3fHM3fCYu+Ll7vjy9/vY5vRkmtSlw+ayzOpyothKic2lxOZLic2Ls9+/1e3Z5fSlw+c+gMqLs96YvOKxzOr///8xeMYqO335AAAAEHRSTlMA34AQvyBfYCB/z8/Pz78Qi8soFQAAAk5JREFUeF7szsENgDAQBLE5HhCkkFSz/beGKALdZ1yBgX2vtHhOPqPSpgZQaVSbK60OZlot0oz8xYABAwYMGDBgwIABAwYMGDBgwIABAwYMGDDwtm8nO1LDQACGQ8OABNLQ2XpdnJTHA8YGTLr8/q/GcsJTJmkO5br0f26pP1k+VEVy2Pvvxx40/kpDr47jaX8bAP8/Ajh0SmMmNe5LAD6rGSxYbsAOcDbDCwgKURLQAIoCGo2iAKdRFOAAZQGfUBbgUBhAD0APfttYa83WX843A0YSJAAYSfkD0FOIf+XWlzxgOZUAhphvi2m9JT9xa2AEfMEkCFnmGtgAity1bM5yAdoEoONMPABMAmGA/AmgKQ5oMakvDnjCtGtpwIZMoLYs4Ae+DOqigIA02LECqJOm6nIAg9mgDpwACqXpq2UGLM+kV8sNoCMBJfADoseZusALWBZAwwxY3s06fkB0m1kBA4C0hrm7yAxYJnTMgGWCYQHQzAbzARuAXkfAXDUngG5CtCdGAG3SSDIlAdEpAvCsANqEL/paFkAFUBZAJxVdHGAwrTgg6hKAuQm8LQFQ3a0nAEwABBvz7TBpYAL8e/IETLqyAfKEcMS0mhOAqOrEEDzZFiz7V7L+6E+7w+GwP3lFl5UhsgKWq4UB36IsQFthgI+ygCnKAnwUBYCJjIARF9JT4N2O3QRLf8++njd+0JipfTbl3hc023EznNs/EN2eL8/ehPv7ghnAHXAHPMoC3lcrWcDb6qPs0++qqh4EBa8eqt+9+yADeLN6XVU/AZaNDaYVEGRKAAAAAElFTkSuQmCC',
    //   //   title: 'TypeScript logo',
    //   // },
    //   talks: [
    //     {
    //       title: 'Keynote with Anders Hejlsberg',
    //       speaker: {
    //         name: 'Anders Hejlsberg',
    //       },
    //       duration: '2 hours',
    //       day: 1,
    //       description: 'An incredible keynote speech on the future of TypeScript',
    //     },
    //     {
    //       title: 'Latest TypeScript features',
    //       speaker: {
    //         name: 'Daniel Rosenwasser',
    //       },
    //       duration: '1 hour',
    //       day: 2,
    //       description: 'All the latest TypeScript features you can use today',
    //     }
    //   ]
    // });
  }

  public ngOnInit(): void {
    const confId = Number(this.route.snapshot.paramMap.get('id'));

    this.subs.push(
      this.dataService.getConferences$.subscribe((conferences: Conference[]) => {
        this.confs = conferences;
        const conf = this.confs.filter((conf) => conf.id === confId)[0];
        if (!conf) {
          this.router.navigateByUrl('/not-found');
        } else {
          this.conf = conf;
          this.days = this.calculateDays();
        }
      })
    );
    this.dataService.getConferences();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private calculateDays(): number {
    const start = new Date(this.conf.startDateTime);
    const end = new Date(this.conf.endDateTime);
    return differenceInCalendarDays(end, start) + 1;
  }
}
