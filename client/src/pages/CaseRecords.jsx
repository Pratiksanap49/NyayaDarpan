import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { fetchCaseRecords } from "../features/rojnama/rojnamaSlice.js";

const statusStyles = {
  draft: "bg-slate-100 text-slate-700",
  needs_correction: "bg-amber-100 text-amber-800",
  submitted: "bg-blue-100 text-blue-800",
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

// Render the stenographer's records for one case.
function CaseRecords() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { records, recordsCase, recordsStatus, recordsError } = useSelector(
    (state) => state.rojnama,
  );

  useEffect(() => {
    dispatch(fetchCaseRecords(caseId));
  }, [caseId, dispatch]);

  const isLoading = recordsStatus === "loading" || recordsStatus === "idle";

  return (
    <div className="space-y-6">
      <Link
        to="/steno"
        className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
      >
        Back to dashboard
      </Link>

      <header>
        <p className="text-sm font-semibold text-[var(--color-accent)]">
          Case records
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy md:text-3xl">
          {recordsCase?.caseNumber || "Rojnama records"}
        </h1>
        {recordsCase?.title ? (
          <p className="mt-2 text-sm text-brand-muted">{recordsCase.title}</p>
        ) : null}
      </header>

      {recordsError ? <Alert variant="error">{recordsError}</Alert> : null}
      {isLoading ? (
        <p className="text-sm text-brand-muted">Loading records...</p>
      ) : null}

      {!isLoading && !recordsError ? (
        <Card className="overflow-hidden">
          {records.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-brand-muted">
              No Rojnama records for this case yet
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-muted">
                  <tr>
                    <th className="px-5 py-3 font-bold">Hearing date</th>
                    <th className="px-5 py-3 font-bold">Purpose</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Next hearing</th>
                    <th className="px-5 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {records.map((record) => {
                    const canEdit = ["draft", "needs_correction"].includes(
                      record.status,
                    );

                    return (
                      <tr key={record.id}>
                        <td className="whitespace-nowrap px-5 py-4 text-brand-navy">
                          {formatDate(record.hearingDate)}
                        </td>
                        <td className="max-w-xs px-5 py-4 text-brand-gray">
                          {record.purpose || "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[record.status] || "bg-slate-100 text-slate-700"}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-brand-gray">
                          {formatDate(record.nextHearingDate)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() =>
                              navigate(`/steno/rojnama/${record.id}`)
                            }
                          >
                            {canEdit ? "Edit" : "View"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}

export default CaseRecords;
