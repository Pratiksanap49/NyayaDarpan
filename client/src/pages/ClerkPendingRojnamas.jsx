import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { fetchPendingRojnamas } from "../features/rojnama/rojnamaSlice.js";

const statusStyles = {
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

function ClerkPendingRojnamas() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pending, pendingStatus, pendingError } = useSelector(
    (state) => state.rojnama,
  );

  useEffect(() => {
    dispatch(fetchPendingRojnamas());
  }, [dispatch]);

  const isLoading = pendingStatus === "loading" || pendingStatus === "idle";

  return (
    <div className="space-y-6">
      <Link
        to="/clerk"
        className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
      >
        Back to dashboard
      </Link>

      <header>
        <p className="text-sm font-semibold text-[var(--color-accent)]">
          Clerk review
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy md:text-3xl">
          Pending Rojnamas
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          Submitted hearing records waiting for review.
        </p>
      </header>

      {pendingError ? <Alert variant="error">{pendingError}</Alert> : null}
      {isLoading ? (
        <p className="text-sm text-brand-muted">Loading pending Rojnamas...</p>
      ) : null}

      {!isLoading && !pendingError ? (
        <Card className="overflow-hidden">
          {pending.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-brand-muted">
              No pending Rojnamas
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-muted">
                  <tr>
                    <th className="px-5 py-3 font-bold">Case number</th>
                    <th className="px-5 py-3 font-bold">Case title</th>
                    <th className="px-5 py-3 font-bold">Hearing date</th>
                    <th className="px-5 py-3 font-bold">Purpose</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {pending.map((rojnama) => (
                    <tr key={rojnama._id}>
                      <td className="whitespace-nowrap px-5 py-4 text-brand-navy">
                        {rojnama.caseId?.caseNumber || "-"}
                      </td>
                      <td className="max-w-xs px-5 py-4 text-brand-gray">
                        {rojnama.caseId?.title || "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-brand-gray">
                        {formatDate(rojnama.hearingDate)}
                      </td>
                      <td className="max-w-sm px-5 py-4 text-brand-gray">
                        {rojnama.purpose || "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            statusStyles[rojnama.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {rojnama.status || "-"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() =>
                            navigate(`/clerk/rojnama/${rojnama._id}`)
                          }
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}

export default ClerkPendingRojnamas;
