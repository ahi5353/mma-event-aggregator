import { TournamentEvent } from './tournament-event.model';

export interface CalendarDay {
	date: Date;
	events: TournamentEvent[];
		isCurrentMonth: boolean;
		isToday: boolean;
}
