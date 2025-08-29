import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { TournamentEvent } from '../../../services/model/tournament-event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, MatCardModule, DatePipe],
	templateUrl: './calendar.html',
	styleUrls: ['./calendar.scss']
})
export class Calendar implements OnInit {
	events: TournamentEvent[] = [];

	constructor(private eventService: EventService) {}

	ngOnInit(): void {
		this.eventService.getEvents().subscribe((data) => {
			this.events = data;
		});
	}
}
