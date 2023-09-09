import { QueryClient } from "@tanstack/react-query";

export const queryClientObj = new QueryClient();

export async function fetchEvents({signal, searchEl, max}) {
    console.log(searchEl);
    let url = 'http://localhost:3000/events';

    if(searchEl && max){
      url+= "?search=" + searchEl +"&max=" + max;
    }
    else if(searchEl){
      url+= "?search="+searchEl;
    }
    else if(max){
      url+= "?max=" + max;
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


export async function createNewEvent({event}) { //{event} from mutate({event : formData}) in NewEvent.jsx
    console.log(event);
    const response = await fetch(`http://localhost:3000/events`, {
      method: 'POST',
      body: JSON.stringify({event}), //sending request body as exactly the backend wants. it wants {event : ______}
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
  
    const resData = await response.json();
  
    return resData;
}


export async function fetchImages({signal}) {
    let url = 'http://localhost:3000/events/images';

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the images.');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { images } = await response.json();

    return images;
}

export async function deleteEvent({id1}){    //{id} from mutate({id1 : params.id}) in EventDetails.jsx
  let url = 'http://localhost:3000/events/'+id1;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {                              //here no body required for backend.
      "Content-Type":"application/json", 
    }
  });

    if (!response.ok) {
      const error = new Error('An error occurred while deleting the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { message } = await response.json();

    return message;
}

export async function fetchEventDetails({signal, id}){
  let url = 'http://localhost:3000/events/'+id;

  const response = await fetch(url,{signal});

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { event } = await response.json();

    return event;
}

export async function updateEvent({id1, event}) { ////{id1, event} from mutate({id1 : params.id, event : formData}) in EditEvent.jsx
  const response = await fetch(`http://localhost:3000/events/${id1}`, {
    method: 'PUT',
    body: JSON.stringify({event}), ////sending request body as exactly the backend wants. it wants {event : ______}
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

  const resData = await response.json();

  return resData;
}

