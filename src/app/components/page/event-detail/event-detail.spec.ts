import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EventService } from '../../../services/event.service';
import { EventDetail } from './event-detail';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EventDetail', () => {
  let component: EventDetail;
  let fixture: ComponentFixture<EventDetail>;
  let mockEventService: jasmine.SpyObj<EventService>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => '123', // return a mock ID
      },
    },
  };

  beforeEach(async () => {
    // Create a spy object for the EventService
    mockEventService = jasmine.createSpyObj('EventService', ['getEventById']);
    // Configure the spy to return a mock event
    mockEventService.getEventById.and.returnValue(of({
      id: '123',
      title: 'Test Event',
      start: new Date(),
      meta: {
        location: 'Test Location',
        organization: 'Test Org',
        description: '',
        source: '',
        card: ['Fight 1', 'Fight 2'],
        results: [],
      }
    }));

    await TestBed.configureTestingModule({
      imports: [EventDetail, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: EventService, useValue: mockEventService }
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
