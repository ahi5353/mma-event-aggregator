import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventService } from '../../../services/event.service';
import { CalendarDay } from '../../../services/model/calendar-day.model';
import { TournamentEvent } from '../../../services/model/tournament-event.model';
import { EventDetail } from '../event-detail/event-detail';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, MatCardModule, DatePipe, MatTooltipModule],
	templateUrl: './calendar.html',
	styleUrls: ['./calendar.scss'],
})
export class Calendar {
	private eventService = inject(EventService);
	private dialog = inject(MatDialog);

	private events = toSignal(this.eventService.getEvents(), { initialValue: [] });
	currentDate = signal(new Date());

	calendarDays = computed(() => {
		const events = this.events();
		const date = this.currentDate();
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);
		const firstDayOfWeek = this.getFirstDayOfWeek(firstDayOfMonth);

		const calendarDays: CalendarDay[] = [];
		let currentDate = firstDayOfWeek;

		while (currentDate <= lastDayOfMonth || calendarDays.length % 7 !== 0) {
			const day: CalendarDay = {
				date: new Date(currentDate),
				events: this.getEventsForDay(events, currentDate),
				isCurrentMonth: currentDate.getMonth() === month,
				isToday: this.isToday(currentDate),
			};
			calendarDays.push(day);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return calendarDays;
	});

	private getFirstDayOfWeek(date: Date): Date {
		const dayOfWeek = date.getDay();
		const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
		return new Date(date.setDate(diff));
	}

	private getEventsForDay(
		events: TournamentEvent[],
		date: Date
	): TournamentEvent[] {
		return events.filter((event) => {
			const eventDate = new Date(event.start);
			return this.isSameDay(eventDate, date);
		});
	}

	private isSameDay(date1: Date, date2: Date): boolean {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}

	private isToday(date: Date): boolean {
		const today = new Date();
		return this.isSameDay(today, date);
	}

	goToPreviousMonth(): void {
		this.currentDate.update((d) => {
			const newDate = new Date(d);
			newDate.setMonth(newDate.getMonth() - 1);
			return newDate;
		});
	}

	goToNextMonth(): void {
		this.currentDate.update((d) => {
			const newDate = new Date(d);
			newDate.setMonth(newDate.getMonth() + 1);
			return newDate;
		});
	}

	openEventModal(event: TournamentEvent): void {
		this.dialog.open(EventDetail, {
			data: event,
			width: '80%',
			maxWidth: '600px',
			autoFocus: false,
		});
	}
}
