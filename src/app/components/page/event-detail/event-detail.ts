import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { TournamentEvent } from '../../../services/model/tournament-event.model';

export interface FightCard {
	player1: string;
	player2: string;
	original: string;
}

@Component({
	selector: 'app-event-detail',
	imports: [
		CommonModule,
		MatCardModule,
		DatePipe,
		MatDialogModule,
		MatListModule,
		MatButtonModule,
	],
	templateUrl: './event-detail.html',
	styleUrl: './event-detail.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetail {
	event = signal<TournamentEvent>(inject(MAT_DIALOG_DATA));

	parsedFights = computed<FightCard[]>(() => {
		const card = this.event()?.meta?.card;
		if (!card) {
			return [];
		}

		return card
			.filter(fight => !fight.includes('休憩'))
			.map(fight => {
				const players = fight.split(' vs ');
				if (players.length !== 2) {
					// Return a structure that can be displayed as a single line
					return { player1: fight, player2: '', original: fight };
				}

				// Remove prefixes and suffixes like (Win), (Lose), etc.
				const cleanPlayer = (player: string) =>
					player
						.replace(
							/^\(Win\)|\(Lose\)|\(Draw\)|（-）|第\d+試合[：:]|^\s*|\s*$/g,
							''
						)
						.trim();

				return {
					player1: cleanPlayer(players[0]),
					player2: cleanPlayer(players[1]),
					original: fight,
				};
			});
	});
}
