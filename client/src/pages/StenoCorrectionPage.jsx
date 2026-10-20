import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import RojnamaFields from "../components/rojnama/RojnamaFields.jsx";
import {
  fetchRojnama,
  resubmitRojnama,
  saveDraft,
} from "../features/rojnama/rojnamaSlice.js";
import {
  emptyRojnamaForm,
  getMissingRojnamaFields,
  toDateInputValue,
} from "../utils/rojnamaForm.js";

const statusStyles = {
  needs_correction: "bg-amber-100 text-amber-800",
  resubmitted: "bg-cyan-100 text-cyan-800",
};

const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "-";

const formReducer = (state, action) => {
  if (action.type === "hydrate") {
    return action.form;
  }

  if (action.type === "change") {
    return { ...state, [action.name]: action.value };
  }

  return state;
};

function StenoCorrectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, status, error, actionStatus, actionError } = useSelector(
    (state) => state.rojnama,
  );
  const [form, dispatchForm] = useReducer(formReducer, emptyRojnamaForm);
  const [fieldError, setFieldError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchRojnama(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (current?._id === id) {
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
  const isNeedsCorrection = current?.status === "needs_correction";
  const isSaving = actionStatus === "loading" || status === "loading";

  const handleChange = (event) => {
    dispatchForm({
      type: "change",
      name: event.target.name,
      value: event.target.value,
    });
    setFieldError("");
    setSuccessMessage("");
  };

  const saveChanges = async () => {
    const result = await dispatch(saveDraft({ id, data: form }));

    if (saveDraft.fulfilled.match(result)) {
      setSuccessMessage("Changes saved successfully.");
      return result.payload;
    }

    return null;
  };

  const handleResubmit = async () => {
    const missingFields = getMissingRojnamaFields(form);

    if (missingFields.length > 0) {
      setFieldError(`Complete these fields: ${missingFields.join(", ")}`);
      return;
    }

    const saved = await saveChanges();

    if (!saved) {
      return;
    }

    const result = await dispatch(resubmitRojnama(id));

    if (resubmitRojnama.fulfilled.match(result)) {
      setSuccessMessage("Rojnama resubmitted to the clerk.");
      window.setTimeout(() => navigate("/steno/corrections"), 700);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-brand-muted">Loading Rojnama...</p>;
  }

  if (!current || !isNeedsCorrection) {
    return (
      <div className="space-y-5">
        <BackLink />
        {error ? <Alert variant="error">{error}</Alert> : null}
        {current ? (
          <Alert variant="info">
            This Rojnama is {current.status} and cannot be corrected here.
          </Alert>
        ) : null}
      </div>
    );
  }

  const remarks = [...(current.remarks || [])].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <BackLink />
      <header>
        <p className="text-sm font-semibold text-[var(--color-accent)]">
          Correction required
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy md:text-3xl">
          {current.caseId?.caseNumber || "-"}
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          {current.caseId?.title || "-"}
        </p>
      </header>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {actionError ? <Alert variant="error">{actionError}</Alert> : null}
      {fieldError ? <Alert variant="error">{fieldError}</Alert> : null}
      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

      <Card className="p-5 md:p-7">
        <div className="flex items-center justify-between border-b border-brand-border pb-5">
          <h2 className="text-lg font-bold text-brand-navy">Rojnama details</h2>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[current.status]}`}
          >
            {current.status}
          </span>
        </div>

        <section className="mt-6" aria-labelledby="clerk-remarks-heading">
          <h2
            id="clerk-remarks-heading"
            className="text-lg font-bold text-brand-navy"
          >
            Clerk remarks
          </h2>
          <div className="mt-3 space-y-3">
            {remarks.length === 0 ? (
              <p className="text-sm text-brand-muted">No remarks yet</p>
            ) : (
              remarks.map((remark, index) => (
                <div
                  key={`${remark.createdAt}-${index}`}
                  className={`rounded-md border p-3 ${
                    index === 0
                      ? "border-amber-200 bg-amber-50"
                      : "border-brand-border bg-slate-50"
                  }`}
                >
                  <p className="text-sm text-brand-navy">{remark.text}</p>
                  <p className="mt-2 text-xs text-brand-muted">
                    {remark.author?.name || "Clerk"} •{" "}
                    {formatDateTime(remark.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-6 border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold text-brand-navy">Edit Rojnama</h2>
          <div className="mt-4">
            <RojnamaFields form={form} onChange={handleChange} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={saveChanges}
              disabled={isSaving}
              loading={isSaving}
              loadingText="Saving..."
            >
              Save changes
            </Button>
            <Button
              onClick={handleResubmit}
              disabled={isSaving}
              loading={isSaving}
              loadingText="Resubmitting..."
            >
              Resubmit to clerk
            </Button>
          </div>
        </section>

        <PreviousVersions revisions={current.revisions} />
      </Card>
    </div>
  );
}

function PreviousVersions({ revisions = [] }) {
  return (
    <section className="mt-6 border-t border-brand-border pt-6">
      <h2 className="text-lg font-bold text-brand-navy">Previous versions</h2>
      {revisions.length === 0 ? (
        <p className="mt-3 text-sm text-brand-muted">No previous versions</p>
      ) : (
        <div className="mt-3 space-y-3">
          {[...revisions].reverse().map((revision) => (
            <div
              key={revision.version}
              className="rounded-md border border-brand-border bg-slate-50 p-3"
            >
              <p className="text-sm font-semibold text-brand-navy">
                Version {revision.version}
              </p>
              <p className="mt-1 text-sm text-brand-gray">
                Returned remark: {revision.returnedRemark}
              </p>
              <p className="mt-1 text-xs text-brand-muted">
                Saved {formatDateTime(revision.savedAt)}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-brand-gray">
                {revision.purpose || "-"} • {revision.business || "-"} •{" "}
                {revision.orderDirections || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function BackLink() {
  return (
    <Link
      to="/steno/corrections"
      className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
    >
      Back to corrections
    </Link>
  );
}

export default StenoCorrectionPage;
