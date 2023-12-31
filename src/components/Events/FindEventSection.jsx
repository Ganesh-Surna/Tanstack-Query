import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchEl, setSearchEl]=useState();

  const {data, isLoading, isError, error}=useQuery({
    queryKey:["eventsId", {searchEl: searchEl}],
    queryFn: ({signal, queryKey})=>fetchEvents( { signal, ...queryKey[1] } ),
    enabled: searchEl !== undefined,
  })

  function handleSubmit(event) {
    event.preventDefault();
    setSearchEl(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>

  if(isLoading){
    content= <LoadingIndicator/>
  }

  if(isError){
    content = <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to find events!"}/>;
  }

  if(data){
    content = <ul className='events-list'>
     {
      data.map((event)=>{
        return <li key={event.id}>
          <EventItem event={event}/>
        </li>
      })
    }
    </ul>
}

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
