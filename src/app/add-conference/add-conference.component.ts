import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DataService } from '../data.service';
import { Conference } from '../model';

@Component({
  selector: 'app-add-conference',
  templateUrl: './add-conference.component.html',
  styleUrls: ['./add-conference.component.scss']
})
export class AddConferenceComponent implements OnInit, OnDestroy {
  protected logoDataSrc: string = '';
  protected conferenceForm = new FormGroup({
    name: new FormControl('', Validators.required),
    logo: new FormControl(''),
    startDateTime: new FormControl('', Validators.required),
    endDateTime: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
  });

  private subs: Subscription[] = [];
  private confs: Conference[] = [];

  constructor(private dataService: DataService) {}

  public ngOnInit(): void {
    this.subs.push(
      this.dataService.getConferences$.subscribe((conferences: Conference[]) => {
        this.confs = conferences;
      }),
      this.dataService.setConferences$.subscribe({
        next: () => this.resetForm(),
        error: (error) => console.log(error),
      })
    );
    this.dataService.getConferences();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public uploadLogo(input: HTMLInputElement): void {
    const files: FileList | null = input.files;
    const firstFile: File | null = (files instanceof FileList)
      ? files[0]
      : null;

    const reader: FileReader = new FileReader();
    reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        const value = event.target.result as string;
        this.conferenceForm.patchValue({
          logo: value,
        });
        this.logoDataSrc = value;
      }
    });
    if (firstFile) {
      reader.readAsDataURL(firstFile);
    }
  }

  public save(): void {
    const lastId = (this.confs.length)
      ? this.confs[this.confs.length -1].id
      : 0;

    const desc = this.conferenceForm.get('desc')?.value ?? '';

    const logo = (this.conferenceForm.get('logo')?.value)
      ? this.conferenceForm.get('logo')?.value
      : undefined;

    this.confs.push({
      id: lastId + 1,
      title: this.conferenceForm.get('name')?.value ?? '',
      startDateTime: this.conferenceForm.get('startDateTime')?.value ?? '',
      endDateTime: this.conferenceForm.get('endDateTime')?.value ?? '',
      description: desc,
      shortDescription: (desc.length > 150) ? desc.slice(0, 150) : desc,
      logo: (logo) ? { src: logo } : undefined,
    });

    this.dataService.setConferences(this.confs);
  }

  private resetForm(): void {
    this.conferenceForm.reset();
    this.logoDataSrc = '';
  }
}
