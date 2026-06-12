import { Component, OnInit } from '@angular/core';

// type
import { Experience, ProfileProjectItem } from '../profile2.model';

// data
import { EXPERIENCE, PROJECTS } from '../data';

@Component({
  selector: 'app-profile2-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  experience: Experience[] = [];
  projects: ProfileProjectItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this._fetchData();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.experience = EXPERIENCE;
    this.projects = PROJECTS;
  }

}
