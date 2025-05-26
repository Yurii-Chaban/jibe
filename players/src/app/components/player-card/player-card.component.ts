import { Component, EventEmitter, Output, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-player-card',
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerCardComponent {
  public player = input.required<Player>();
  public isSelected = input(false);
  public listType = input<'available' | 'selected'>('available');
  
  @Output() public onSelect = new EventEmitter<Player>();
  @Output() public onRemove = new EventEmitter<Player>();
  @Output() public onShowDetails = new EventEmitter<Player>();
  
  public firstName = computed(() => 
    this.player() ? this.getFirstName(this.player().name) : ''
  );
  
  public lastName = computed(() => 
    this.player() ? this.getLastName(this.player().name) : ''
  );
  
  private getFirstName(name: string): string {
    return name.split(' ')[0];
  }
  
  private getLastName(name: string): string {
    return name.split(' ')[1];
  }
  
  public selectPlayer(event: Event): void {
    event.stopPropagation();

    this.onSelect.emit(this.player());
  }
  
  public removePlayer(event: Event): void {
    event.stopPropagation();
    
    this.onRemove.emit(this.player());
  }
  
  public showDetails(): void {
    this.onShowDetails.emit(this.player());
  }
} 