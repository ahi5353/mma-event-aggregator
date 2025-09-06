import axios from 'axios';
import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://gonkaku.jp';
const NAMESPACE = 'f99b71c7-7a48-43e6-8958-868a6260b0d3';

interface Event {
  id: string;
  title: string;
  start: string;
  meta: {
    organization: string;
    location: string;
    description:string;
    source: string;
    card: string[];
    results: any[];
  };
}

const parseDate = (dateStr: string): Date | null => {
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    return new Date(Date.UTC(year, month, day, 12, 0, 0));
  }
  return null;
};

const scrapeEventPage = async (url: string): Promise<Event | null> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('h1.event-title').text().trim();
    if (!title) return null;

    const dateStr = $('.event-date').text().trim();
    const date = parseDate(dateStr);

    if (!date) return null;

    const attributeText = $('.attribute-text').text().trim();
    const parts = attributeText.split('/').map(p => p.trim());

    let organization = parts[1] || 'Unknown';
    if (organization.includes('主催:')) {
        organization = parts[0];
    }

    let location = 'TBA';
    const locationPart = parts.find(p => p.startsWith('開催地:'));
    if (locationPart) {
        location = locationPart.replace('開催地:', '').trim();
    }

    const cardSet = new Set<string>();
    const content = $('.detail-content');
    content.find('br').replaceWith('\n');
    const text = content.text();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('▼')) {
            if (i + 2 < lines.length && !lines[i+1].startsWith('▼') && !lines[i+2].startsWith('▼')) {
                const fighter1 = lines[i+1].replace(/（.*）/g, '').trim();
                const fighter2 = lines[i+2].replace(/（.*）/g, '').trim();
                if (fighter1 && fighter2) {
                    cardSet.add(`${fighter1} vs ${fighter2}`);
                }
                i += 2;
            }
        }
    }

    const card = Array.from(cardSet);

    return {
      id: uuidv5(url, NAMESPACE),
      title,
      start: date.toISOString(),
      meta: {
        organization,
        location,
        description: url,
        source: 'gonkaku.jp',
        card,
        results: [],
      },
    };
  } catch (error) {
    if (error instanceof Error) {
        console.error(`Failed to scrape ${url}: ${error.message}`);
    } else {
        console.error(`An unknown error occurred while scraping ${url}:`, error);
    }
    return null;
  }
};


const main = async () => {
  console.log('Scraping script started...');
  try {
    const eventsFilePath = path.resolve(process.cwd(), 'public/events.json');
    let existingEvents: Event[] = [];
    if (fs.existsSync(eventsFilePath)) {
        const fileContent = fs.readFileSync(eventsFilePath, 'utf-8');
        if (fileContent) {
            existingEvents = JSON.parse(fileContent);
        }
    }

    const { data } = await axios.get(`${BASE_URL}/events`);
    const $ = cheerio.load(data);

    const eventUrls = new Set<string>();
    $('a[href*="/events/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.match(/\/events\/[a-zA-Z0-9]+$/)) {
        if (href.startsWith('/')) {
            eventUrls.add(`${BASE_URL}${href}`);
        } else {
            eventUrls.add(href);
        }
      }
    });

    console.log(`Found ${eventUrls.size} unique event URLs to scrape.`);

    const scrapedEvents: Event[] = [];
    for (const url of Array.from(eventUrls)) {
      const event = await scrapeEventPage(url);
      if (event) {
        scrapedEvents.push(event);
      }
    }
    console.log(`Successfully scraped ${scrapedEvents.length} events.`);

    const eventsMap = new Map<string, Event>();
    existingEvents.forEach(event => eventsMap.set(event.id, event));
    scrapedEvents.forEach(event => eventsMap.set(event.id, event));

    const allEvents = Array.from(eventsMap.values());

    allEvents.forEach(event => {
        const cardSet = new Set<string>();
        event.meta.card.forEach(match => {
            const cleanedMatch = match.replace(/^(第\d+試合／|・)/, '').trim();
            cardSet.add(cleanedMatch);
        });
        event.meta.card = Array.from(cardSet);
    });

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const finalEvents = allEvents.filter(event => new Date(event.start) >= oneYearAgo);

    finalEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    console.log(`Final event count: ${finalEvents.length}`);

    fs.writeFileSync(eventsFilePath, JSON.stringify(finalEvents, null, 2), 'utf-8');
    console.log(`Successfully updated ${eventsFilePath}`);

  } catch (error) {
    if (error instanceof Error) {
        console.error('An error occurred:', error.message);
    } else {
        console.error('An unknown error occurred:', error);
    }
  }
};

main();
