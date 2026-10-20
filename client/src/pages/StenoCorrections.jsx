import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { fetchNeedsCorrection } from "../features/rojnama/rojnamaSlice.js";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    new Date(value),
  );
};

function StenoCorrections() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { needsCorrection, needsCorrectionStatus, needsCorrectionError } =
    useSelector((state) => state.rojnama);

  useEffect(() => {
    dispatch(fetchNeedsCorrection());
  }, [dispatch]);

  const isLoading =
    needsCorrectionStatus === "loading" ||
    needsCorrectionStatus === "idle";

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
          Clerk remarks
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy md:text-3xl">
          Rojnamas needing correction
        </h1>
      </header>

      {needsCorrectionError ? (
        <Alert variant="error">{needsCorrectionError}</Alert>
      ) : null}
      {isLoading ? (
        <p className="text-sm text-brand-muted">
          Loading Rojnamas needing correction...
        </p>
      ) : null}

      {!isLoading && !needsCorrectionError ? (
        <Card className="overflow-hidden">
          {needsCorrection.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-brand-muted">
              No Rojnamas need correction
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-muted">
                  <tr>
                    <th className="px-5 py-3 font-bold">Case number</th>
                    <th className="px-5 py-3 font-bold">Case title</th>
                    <th className="px-5 py-3 font-bold">Hearing date</th>
                    <th className="px-5 py-3 font-bold">Remarks</th>
                    <th className="px-5 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {needsCorrection.map((record) => (
                    <tr key={record._id}>
                      <td className="whitespace-nowrap px-5 py-4 text-brand-navy">
                        {record.caseId?.caseNumber || "-"}
                      </td>
                      <td className="max-w-xs px-5 py-4 text-brand-gray">
                        {record.caseId?.title || "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-brand-gray">
                        {formatDate(record.hearingDate)}
                      </td>
                      <td className="px-5 py-4 text-brand-gray">
                        {record.remarks?.length || 0}
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/steno/corrections/${record._id}`)
                          }
                        >
                          Correct
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

export default StenoCorrections;
