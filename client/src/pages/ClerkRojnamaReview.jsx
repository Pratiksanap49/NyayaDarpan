import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import {
  approveRojnama,
  fetchRojnama,
  sendRemark,
} from "../features/rojnama/rojnamaSlice.js";

const statusStyles = {
  draft: "bg-slate-100 text-slate-700",
  submitted: "bg-blue-100 text-blue-800",
  needs_correction: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const readOnlyNote = {
  needs_correction: "Waiting for the stenographer to correct this Rojnama.",
  approved: "Approved and added to the case records.",
  draft: "This Rojnama is still a draft.",
};

function ClerkRojnamaReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, status, error, actionStatus, actionError } = useSelector(
    (state) => state.rojnama,
  );
  const [remarkText, setRemarkText] = useState("");
  const [remarkError, setRemarkError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchRojnama(id));
  }, [dispatch, id]);

  const isLoading = status === "loading" || status === "idle";
  const isSubmitting = actionStatus === "loading";
  const isSubmitted = current?.status === "submitted";

  const returnToPending = (message) => {
    setSuccessMessage(message);
    window.setTimeout(() => navigate("/clerk/pending"), 700);
  };

  const handleSendRemark = async () => {
    const text = remarkText.trim();

    if (!text) {
      setRemarkError("Remark text is required.");
      return;
    }

    if (text.length > 1000) {
      setRemarkError("Remark must be 1000 characters or fewer.");
      return;
    }

    setRemarkError("");
    const result = await dispatch(sendRemark({ id, text }));

    if (sendRemark.fulfilled.match(result)) {
      returnToPending("Remarks sent successfully.");
    }
  };

  const handleApprove = async () => {
    const result = await dispatch(approveRojnama(id));

    if (approveRojnama.fulfilled.match(result)) {
      returnToPending("Rojnama approved and added to the case records.");
    }
  };

  if (isLoading) {
    return <p className="text-sm text-brand-muted">Loading Rojnama...</p>;
  }

  if (!current) {
    return (
      <div className="space-y-5">
        <BackLink />
        {error ? <Alert variant="error">{error}</Alert> : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <BackLink />

      <header>
        <p className="text-sm font-semibold text-[var(--color-accent)]">
          Clerk review
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
      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

      <Card className="p-5 md:p-7">
        <div className="grid gap-5 border-b border-brand-border pb-5 sm:grid-cols-2">
          <Detail label="Hearing date" value={formatDate(current.hearingDate)} />
          <Detail label="Next hearing date" value={formatDate(current.nextHearingDate)} />
          <Detail label="Purpose" value={current.purpose} />
          <Detail label="Status">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                statusStyles[current.status] || "bg-slate-100 text-slate-700"
              }`}
            >
              {current.status || "-"}
            </span>
          </Detail>
          <Detail label="Business" value={current.business} fullWidth />
          <Detail label="Order directions" value={current.orderDirections} fullWidth />
        </div>

        <section className="mt-6" aria-labelledby="remarks-heading">
          <h2 id="remarks-heading" className="text-lg font-bold text-brand-navy">
            Remarks history
          </h2>
          {current.remarks?.length ? (
            <div className="mt-3 space-y-3">
              {[...current.remarks]
                .sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt))
                .map((remark, index) => (
                  <div
                    key={`${remark.createdAt}-${index}`}
                    className="rounded-md border border-brand-border bg-slate-50 p-3"
                  >
                    <p className="text-sm text-brand-navy">{remark.text}</p>
                    <p className="mt-2 text-xs text-brand-muted">
                      {remark.author?.name || "Clerk"} • {formatDateTime(remark.createdAt)}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-brand-muted">No remarks yet</p>
          )}
        </section>

        {isSubmitted ? (
          <section className="mt-6 border-t border-brand-border pt-6">
            <div className="grid gap-4">
              <Textarea
                label="Remark"
                id="clerk-remark"
                value={remarkText}
                onChange={(event) => {
                  setRemarkText(event.target.value);
                  setRemarkError("");
                }}
                error={remarkError}
                maxLength={1000}
                placeholder="Write a correction remark"
              />
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleSendRemark}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  loadingText="Sending..."
                >
                  Send remarks
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  loadingText="Approving..."
                >
                  Add to RojList
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <Alert variant="info">
            {readOnlyNote[current.status] || "This Rojnama is read-only."}
          </Alert>
        )}
      </Card>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/clerk/pending"
      className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
    >
      Back to pending list
    </Link>
  );
}

function Detail({ label, value, children, fullWidth = false }) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">
        {label}
      </p>
      {children || (
        <p className="mt-1 whitespace-pre-wrap text-sm text-brand-navy">
          {value || "-"}
        </p>
      )}
    </div>
  );
}

export default ClerkRojnamaReview;
