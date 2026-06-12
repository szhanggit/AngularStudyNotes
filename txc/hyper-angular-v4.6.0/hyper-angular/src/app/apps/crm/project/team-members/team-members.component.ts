import { Component, Input, OnInit } from '@angular/core';

// types
import { TeamMember } from '../../shared/crm.model';

@Component({
  selector: 'app-project-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {

  @Input() team: TeamMember[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
