import { Component, OnInit, DestroyRef, inject, signal, computed, ChangeDetectionStrategy, Signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Player } from '../models/player.model';
import { TeamStats } from '../models/team-stats.model';
import { PlayerCardComponent } from '../components/player-card/player-card.component';
import { PlayerDetailsComponent } from '../components/player-details/player-details.component';
import { TeamStatsComponent } from '../components/team-stats/team-stats.component';
import { PlayerService } from '../services/player.service';

const MAX_TEAM_SIZE = 11;
const MAX_BATSMEN = 6;
const MAX_BOWLERS = 6;
const MAX_WICKET_KEEPERS = 1;
const MAX_ALL_ROUNDERS = 4;

@Component({
  selector: 'app-team-selection',
  imports: [CommonModule, PlayerCardComponent, PlayerDetailsComponent, TeamStatsComponent],
  providers: [PlayerService],
  templateUrl: './team-selection.component.html',
  styleUrl: './team-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamSelectionComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly playerService: PlayerService = inject(PlayerService);

  readonly showInstructions = signal<boolean>(true);
  readonly availablePlayers = signal<Player[]>([]);
  readonly selectedPlayers = signal<Player[]>([]);
  readonly selectedPlayer = signal<Player | null>(null);

  readonly teamStats = computed<TeamStats>(() => {
    const players = this.selectedPlayers();
    const playersByType = this.countPlayersByType(players);
    
    return {
      totalPlayers: players.length,
      batsmenCount: playersByType['Batsman'] || 0,
      bowlersCount: playersByType['Bowler'] || 0,
      wicketKeepersCount: playersByType['WicketKeeper'] || 0,
      allRoundersCount: playersByType['AllRounder'] || 0,
      teamFull: players.length >= MAX_TEAM_SIZE
    };
  });
  
  readonly canAddBatsman = computed(() => this.teamStats().batsmenCount < MAX_BATSMEN);
  readonly canAddBowler = computed(() => this.teamStats().bowlersCount < MAX_BOWLERS);
  readonly canAddWicketKeeper = computed(() => this.teamStats().wicketKeepersCount < MAX_WICKET_KEEPERS);
  readonly canAddAllRounder = computed(() => this.teamStats().allRoundersCount < MAX_ALL_ROUNDERS);
  readonly canAddPlayer = computed<Record<string, boolean>>(() => ({
    'Batsman': this.canAddBatsman(),
    'Bowler': this.canAddBowler(),
    'WicketKeeper': this.canAddWicketKeeper(),
    'AllRounder': this.canAddAllRounder()
  }));

  public ngOnInit(): void {
    this.loadPlayers();
  }

  private loadPlayers(): void {
    this.playerService.getPlayers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (players: Player[]) => {
          this.availablePlayers.set(players);
        },
        error: (err: Error) => {
          console.error('Failed to load players:', err);
        }
      });
  }

  private countPlayersByType(players: Player[]): Record<string, number> {
    return players.reduce((counts, player) => {
      counts[player.type] = (counts[player.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  public closeInstructions(): void {
    this.showInstructions.set(false);
  }

  public selectPlayer(player: Player): void {
    const stats = this.teamStats();
    
    if (stats.teamFull) {
      alert(`Only ${MAX_TEAM_SIZE} players are allowed in a team`);
      return;
    }

    if (!this.canAddPlayer()[player.type]) {
      const maxPlayers = {
        'Batsman': MAX_BATSMEN,
        'Bowler': MAX_BOWLERS,
        'WicketKeeper': MAX_WICKET_KEEPERS,
        'AllRounder': MAX_ALL_ROUNDERS
      }[player.type];
      
      alert(`${this.formatPlayerType(player.type)} can not be more than ${maxPlayers}`);
      return;
    }

    this.movePlayer(player, this.availablePlayers, this.selectedPlayers);
  }

  public removePlayer(player: Player): void {
    this.movePlayer(player, this.selectedPlayers, this.availablePlayers);
  }

  private movePlayer(
    player: Player, 
    sourceList: WritableSignal<Player[]>, 
    targetList: WritableSignal<Player[]>
  ): void {
    sourceList.update(players => 
      players.filter(p => p.name !== player.name)
    );
    
    targetList.update(players => [...players, player]);
  }

  public showPlayerDetails(player: Player): void {
    this.selectedPlayer.set(player);
  }

  public closePlayerDetails(): void {
    this.selectedPlayer.set(null);
  }

  public isPlayerSelected(player: Player): boolean {
    return this.selectedPlayers().some(
      (selectedPlayer: Player) => selectedPlayer.name === player.name
    );
  }

  public getFirstName(name: string): string {
    return name.split(' ')[0];
  }

  public getLastName(name: string): string {
    return name.split(' ')[1];
  }

  public formatPlayerType(type: string): string {
    return type.replace(/([A-Z])/g, ' $1').trim();
  }
} 