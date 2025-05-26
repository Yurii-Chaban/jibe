import { Injectable } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { Player } from '../models/player.model';
import players from '../../assets/data/players.json';

@Injectable()
export class PlayerService {
  private players$: Observable<Player[]> | null = null;
  
  constructor() {}
  
  public getPlayers(): Observable<Player[]> {
    if (!this.players$) {
      this.players$ = this.fetchPlayers().pipe(shareReplay(1));
    }

    return this.players$;
  }
  
  private fetchPlayers(): Observable<Player[]> {
    return of(players).pipe(
      map(response => response.players)
    );
  }
} 