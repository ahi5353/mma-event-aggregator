import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { TournamentEvent } from '../../../services/model/tournament-event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule, RouterLink, MatCardModule, DatePipe],
  templateUrl: './event-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  event = signal<TournamentEvent | undefined>(undefined);

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe(event => {
        this.event.set(event);
      });
    }
  }
}
