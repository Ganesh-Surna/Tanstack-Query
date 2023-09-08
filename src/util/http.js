import { QueryClient } from "@tanstack/react-query";

export const queryClientObj = new QueryClient();

export async function fetchEvents({signal, searchEl}) {
    console.log(searchEl);
    let url = 'http://localhost:3000/events';

    if(searchEl){
      url+= "?search="+searchEl;
    }
    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
  }


  export async function createNewEvent(eventData) {
    const response = await fetch(`http://localhost:3000/events`, {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = new Error('An error occurred while creating the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const { event } = await response.json();
  
    return event;
  }


  export async function fetchImages({signal}) {
    let url = 'http://localhost:3000/events/images';

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { images } = await response.json();

    return images;
  }