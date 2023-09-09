import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import {
  fetchEventDetails,
  queryClientObj,
  updateEvent,
} from "../../util/http.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { id: params.id }],
    queryFn: ({ signal }) => fetchEventDetails({ signal, id: params.id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data)=>{
      const newEvent=data.event;

      await queryClientObj.cancelQueries(["events",{id: params.id}]);

      const previousEvent=queryClientObj.getQueryData(["events",{id: params.id}]);

      queryClientObj.setQueryData(["events",{id: params.id}], newEvent);

      return {previousEventKey: previousEvent};
    },

    onError: (error, data, context)=>{
      queryClientObj.setQueryData(["events",{id: params.id}],  context.previousEventKey);
    },

    onSettled: ()=>{
      queryClientObj.invalidateQueries(["events",{id: params.id}])
    }
  });

  function handleSubmit(formData) {
    mutate({ event: formData, id: params.id });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }
  if (isError) {
    content = (
      <div className="form-actions">
        <ErrorBlock
          title="An Error Occurred."
          message={error.info?.message || "Failed to update event!"}
        />
        <Link to="../" className="button-text">
          Back
        </Link>
      </div>
    );
  }

  if (data) {
    content=<EventForm inputData={data} onSubmit={handleSubmit}>
      <>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </>
    </EventForm>;
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
