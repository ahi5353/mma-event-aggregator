import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventDetail } from './event-detail';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('EventDetail', () => {
	let component: EventDetail;
	let fixture: ComponentFixture<EventDetail>;

	const mockDialogData = {
		id: '123',
		title: 'Test Event',
		start: new Date(),
		meta: {
			location: 'Test Location',
			organization: 'Test Org',
			description: 'http://test.com',
			source: 'Test Source',
			card: ['Fight 1', 'Fight 2'],
			results: [],
		},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EventDetail],
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: mockDialogData },
				provideNoopAnimations(),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EventDetail);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
