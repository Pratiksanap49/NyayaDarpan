import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import RojnamaFields from "../components/rojnama/RojnamaFields.jsx";
import {
  fetchRojnama,
  saveDraft,
  submitRojnama,
} from "../features/rojnama/rojnamaSlice.js";

const editableStatuses = ["draft", "needs_correction"];

import {
  emptyRojnamaForm,
  toDateInputValue,
} from "../utils/rojnamaForm.js";

const formReducer = (state, action) => {
  if (action.type === "hydrate") {
    return action.form;
  }

  if (action.type === "change") {
    return { ...state, [action.name]: action.value };
  }

  return state;
};

// Render the stenographer's editable or read-only Rojnama form.
function RojnamaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, status, error } = useSelector((state) => state.rojnama);
  const [form, dispatchForm] = useReducer(formReducer, emptyRojnamaForm);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchRojnama(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (current?._id === id || current?.id === id) {
      dispatchForm({
        type: "hydrate",
        form: {
          hearingDate: toDateInputValue(current.hearingDate),
          purpose: current.purpose || "",
          business: current.business || "",
          orderDirections: current.orderDirections || "",
          nextHearingDate: toDateInputValue(current.nextHearingDate),
        },
      });
    }
  }, [current, id]);

  const isLoading = status === "loading" && !current;
  const isEditable = editableStatuses.includes(current?.status);
  const isSaving = status === "loading";

  const handleChange = (event) => {
    dispatchForm({
      type: "change",
      name: event.target.name,
      value: event.target.value,
    });
    setSuccessMessage("");
  };

  const handleSave = async () => {
    setSuccessMessage("");
    const result = await dispatch(saveDraft({ id, data: form }));

    if (saveDraft.fulfilled.match(result)) {
      setSuccessMessage("Draft saved successfully.");
    }
  };

  const handleSubmit = async () => {
    setSuccessMessage("");
    const saved = await dispatch(saveDraft({ id, data: form }));

    if (!saveDraft.fulfilled.match(saved)) {
      return;
    }

    const submitted = await dispatch(submitRojnama(id));

    if (submitRojnama.fulfilled.match(submitted)) {
      navigate("/steno");
    }
  };

  if (isLoading) {
    return <p className="text-sm text-brand-muted">Loading Rojnama...</p>;
  }

  if (!current) {
    return error ? <Alert variant="error">{error}</Alert> : null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-[var(--color-accent)]">
          Rojnama
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy md:text-3xl">
          Hearing record
        </h1>
      </header>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

      <Card className="p-5 md:p-7">
        <div className="mb-6 grid gap-4 border-b border-brand-border pb-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">
              Case number
            </p>
            <p className="mt-1 font-semibold text-brand-navy">
              {current.caseId?.caseNumber || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">
              Case title
            </p>
            <p className="mt-1 font-semibold text-brand-navy">
              {current.caseId?.title || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">
              Status
            </p>
            <p className="mt-1 font-semibold capitalize text-[var(--color-accent)]">
              {current.status}
            </p>
          </div>
        </div>

        {!isEditable ? (
          <Alert variant="info">
            This Rojnama is {current.status} and cannot be edited.
          </Alert>
        ) : null}

        <div className="mt-6">
          <RojnamaFields
            form={form}
            onChange={handleChange}
            readOnly={!isEditable}
          />
        </div>

        {isEditable ? (
          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              loading={isSaving}
              loadingText="Saving..."
            >
              Save draft
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              loading={isSaving}
              loadingText="Submitting..."
            >
              Submit to clerk
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export default RojnamaForm;
