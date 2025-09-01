import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventService } from '../../../services/event.service';
import { CalendarDay } from '../../../services/model/calendar-day.model';
import { TournamentEvent } from '../../../services/model/tournament-event.model';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, MatCardModule, DatePipe, MatTooltipModule],
	templateUrl: './calendar.html',
	styleUrls: ['./calendar.scss'],
})
export class Calendar implements OnInit {
	weeks = signal<CalendarDay[][]>([]);
	currentDate = signal(new Date());
	eventsData: TournamentEvent[] = [];

	constructor(private eventService: EventService) {}

	ngOnInit(): void {
		this.eventService.getEvents().subscribe((data) => {
			this.eventsData = data;
			this.buildCalendar(this.eventsData, this.currentDate());
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
				isToday: this.isToday(currentDate),
			};
			calendarDays.push(day);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		this.weeks.set(this.chunkArray(calendarDays, 7));
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

	private isToday(date: Date): boolean {
		const today = new Date();
		return this.isSameDay(today, date);
	}

	private chunkArray<T>(array: T[], size: number): T[][] {
		const chunks: T[][] = [];
		for (let i = 0; i < array.length; i += size) {
			chunks.push(array.slice(i, i + size));
		}
	return chunks;
}

	goToPreviousMonth(): void {
		const newDate = new Date(this.currentDate());
		newDate.setMonth(newDate.getMonth() - 1);
		this.currentDate.set(newDate);
		this.buildCalendar(this.eventsData, this.currentDate());
	}

	goToNextMonth(): void {
		const newDate = new Date(this.currentDate());
		newDate.setMonth(newDate.getMonth() + 1);
		this.currentDate.set(newDate);
		this.buildCalendar(this.eventsData, this.currentDate());
	}
}
