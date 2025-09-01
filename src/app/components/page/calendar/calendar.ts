import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { EventService } from '../../../services/event.service';
import { CalendarDay } from '../../../services/model/calendar-day.model';
import { TournamentEvent } from '../../../services/model/tournament-event.model';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, MatCardModule, DatePipe],
	templateUrl: './calendar.html',
	styleUrls: ['./calendar.scss'],
})
export class Calendar implements OnInit {
	weeks: CalendarDay[][] = [];
	currentDate = new Date();
	eventsData: TournamentEvent[] = [];

	constructor(private eventService: EventService) {}

	ngOnInit(): void {
		this.eventService.getEvents().subscribe((data) => {
			this.eventsData = data;
			this.buildCalendar(this.eventsData, this.currentDate);
		});
	}

	buildCalendar(events: TournamentEvent[], date: Date): void {
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
			};
			calendarDays.push(day);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		this.weeks = this.chunkArray(calendarDays, 7);
	}

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

	private chunkArray<T>(array: T[], size: number): T[][] {
		const chunks: T[][] = [];
		for (let i = 0; i < array.length; i += size) {
			chunks.push(array.slice(i, i + size));
		}
	return chunks;
}

	goToPreviousMonth(): void {
		this.currentDate.setMonth(this.currentDate.getMonth() - 1);
		this.buildCalendar(this.eventsData, this.currentDate);
	}

	goToNextMonth(): void {
		this.currentDate.setMonth(this.currentDate.getMonth() + 1);
		this.buildCalendar(this.eventsData, this.currentDate);
	}
}
