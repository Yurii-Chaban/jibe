import { Component, input, ChangeDetectionStrategy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamStats } from '../../models/team-stats.model';

@Component({
  selector: 'app-team-stats',
  imports: [CommonModule],
  templateUrl: './team-stats.component.html',
  styleUrl: './team-stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamStatsComponent {
  public stats = input.required<TeamStats>();
} 