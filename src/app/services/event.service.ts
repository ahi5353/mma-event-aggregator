import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TournamentEvent } from './model/tournament-event.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class EventService {
	private http = inject(HttpClient);

	constructor() { }

	getEvents(): Observable<TournamentEvent[]> {
		return this.http.get<TournamentEvent[]>('events.json').pipe(
			map(events => events.map(event => ({
				...event,
				start: new Date(event.start)
			})))
		);
	}
}
