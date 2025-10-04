# Design Document

This document outlines the design and architecture of the application.

## 1. Introduction

This application is a simple event calendar that displays tournament events. Users can view events on a calendar, navigate between months, and see the details of each event, including the fight card.

## 2. Architecture

The application is built with Angular and follows a component-based architecture. It uses Angular Material for UI components and signals for state management. The overall structure is as follows:

- **`EventService`**: A root-level service responsible for fetching event data.
- **Components**: The UI is composed of several components:
  - **`Calendar`**: The main component that displays the calendar.
  - **`EventDetail`**: A component that shows the details of an event in a dialog.
- **Data Model**: The application uses a `TournamentEvent` model to represent event data.

## 3. Components

### 3.1. Calendar Component

- **File**: `src/app/components/page/calendar/calendar.ts`
- **Description**: This component displays a monthly calendar grid. It fetches events from the `EventService` and places them on the corresponding days.
- **Features**:
  - Displays a calendar for the current month.
  - Allows users to navigate to the previous and next months.
  - Shows the number of events on each day.
  - Opens a dialog with event details when a day is clicked.

### 3.2. EventDetail Component

- **File**: `src/app/components/page/event-detail/event-detail.ts`
- **Description**: This component displays the details of a single tournament event in a dialog.
- **Features**:
  - Shows the event's title, date, and other metadata.
  - Parses and displays the fight card, showing the matchups between players.

## 4. Services

### 4.1. EventService

- **File**: `src/app/services/event.service.ts`
- **Description**: This service is responsible for fetching event data from a JSON file (`events.json`).
- **Methods**:
  - **`getEvents()`**: Returns an `Observable` of all `TournamentEvent` objects.
  - **`getEventById(id: string)`**: Returns an `Observable` of a single `TournamentEvent` that matches the given ID.