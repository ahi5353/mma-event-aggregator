import { Routes } from '@angular/router';
import { Calendar } from './components/page/calendar/calendar';
import { EventDetail } from './components/page/event-detail/event-detail';

export const routes: Routes = [
  { path: '', component: Calendar },
  { path: 'event/:id', component: EventDetail },
];
