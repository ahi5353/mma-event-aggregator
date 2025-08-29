export interface TournamentEvent {
  id: string;
  title: string;
  start: Date;
  meta: {
	location: string;
	organization: string;
	description: string;
	source: string;
	card: string[];
	results: string[];
  };
}
