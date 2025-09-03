import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { TournamentEvent } from '../../../services/model/tournament-event.model';

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
}
