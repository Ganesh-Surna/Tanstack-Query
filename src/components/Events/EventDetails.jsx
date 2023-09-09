import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteEvent,
  fetchEventDetails,
  queryClientObj,
} from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { id: params.id }],
    queryFn: ({ signal }) => fetchEventDetails({ signal, id: params.id }),
    // staleTime: 5000,
  });

  const {
    mutate,
    isPending: isDeletionPending,
    isError: isDeletionError,
    error: deletionError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClientObj.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      // window.alert("Deleted successfully!");
      navigate("/events");
    },
  });

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  function handleDelete() {
    // const sure = window.confirm("Are you sure?");

    // if(sure){
    //   mutate({id: params.id});
    // }

    mutate({ id1: params.id }); // our wish because no request body is sending in deleteEvent()
  }

  let content;

  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="An Error Occurred."
          message={error.info?.message || "Couldn't fetch event!"}
        />
      </div>
    );
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>This can not be redone!</p>
          <div className="form-actions">
            {isDeletionPending && <p>Deleting, please wait!</p>}
            {!isDeletionPending && (
              <>
                <button onClick={handleStopDelete} className="button-text">
                  Cancel
                </button>
                <button onClick={handleDelete} className="button">
                  Delete
                </button>
              </>
            )}
          </div>
          {isDeletionError && (
            <ErrorBlock
              title="An Error Occurred."
              message={deletionError.info?.message || "Failed to delete"}
            />
          )}
        </Modal>
      )}
    </>
  );
}
