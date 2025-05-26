import { Component, Output, EventEmitter, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-player-details',
  imports: [CommonModule],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerDetailsComponent {
  public player = input.required<Player>();
  public isSelected = input(false);
  
  @Output() public onClose = new EventEmitter<void>();
  @Output() public onSelect = new EventEmitter<Player>();
  
  public firstName = computed(() => 
    this.player() ? this.getFirstName(this.player().name) : ''
  );
  
  public lastName = computed(() => 
    this.player() ? this.getLastName(this.player().name) : ''
  );
  
  public getFirstName(name: string): string {
    return name.split(' ')[0];
  }
  
  public getLastName(name: string): string {
    return name.split(' ')[1];
  }
  
  public closeDetails(event: Event): void {
    event.stopPropagation();

    this.onClose.emit();
  }
  
  public selectPlayer(event: Event): void {
    event.stopPropagation();
    
    this.onSelect.emit(this.player());
  }
} 