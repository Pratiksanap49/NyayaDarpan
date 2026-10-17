import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ScheduleTable from "../components/dashboard/ScheduleTable.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import { fetchSchedule, fetchStats } from "../features/hearings/hearingSlice.js";
import { useAuth } from "../features/auth/useAuth.js";
import { createDraft } from "../features/rojnama/rojnamaSlice.js";

const getLocalDateInputValue = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

function StenoDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { schedule, stats, status, error } = useSelector(
    (state) => state.hearings,
  );
  const { status: rojnamaStatus, error: rojnamaError } = useSelector(
    (state) => state.rojnama,
  );

  useEffect(() => {
    dispatch(fetchSchedule());
    dispatch(fetchStats());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";
  const isCreating = rojnamaStatus === "loading";

  // Create a draft from a hearing and open its form.
  const handleCreateRojnama = async (hearing) => {
    const result = await dispatch(
      createDraft({
        caseId: hearing.case.id,
        hearingDate: getLocalDateInputValue(),
      }),
    );

    if (createDraft.fulfilled.match(result)) {
      navigate(`/steno/rojnama/${result.payload._id}`);
    }
  };

  return (
    <div className="space-y-3">
      <header className="mb-1">
        <h1 className="text-xl font-bold text-brand-navy">
          Good Morning, {user?.name || "Stenographer"}
        </h1>
        <p className="mt-1 text-xs text-brand-muted">
          Overview of today&apos;s court proceedings <span className="mx-1">•</span>{" "}
          {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date())}
        </p>
      </header>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {rojnamaError ? <Alert variant="error">{rojnamaError}</Alert> : null}

      <section
        className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        aria-label="Today's statistics"
      >
        <StatCard variant="blue" label="Total cases today" value={stats?.totalToday ?? "-"} hint="Cases scheduled for hearing" />
        <StatCard variant="orange" label="Pending Rojnama entries" value={stats?.pendingCases ?? "-"} hint="Hearing records need to be typed/updated" />
        <StatCard variant="green" label="Completed Rojnama entries" value={stats?.completed ?? "-"} hint="Rojnamas submitted to Clerk" />
      </section>

      <section aria-labelledby="schedule-heading">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <h2
              id="schedule-heading"
              className="text-sm font-bold text-brand-navy"
            >
              Today&apos;s Schedule
            </h2>
            <p className="mt-0.5 text-xs text-brand-muted">
              Select a hearing to view or update Rojnama
            </p>
          </div>
          {isLoading ? (
            <p className="text-sm text-brand-muted">Loading...</p>
          ) : null}
        </div>
        <Card className="rounded-lg shadow-[0_3px_12px_rgb(33_79_120_/_4%)] overflow-hidden p-2">
          <ScheduleTable
            hearings={schedule}
            compact
            renderActions={(hearing) => (
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="md"
                  disabled={isCreating}
                  loading={isCreating}
                  loadingText="Creating..."
                  className="min-h-9 rounded px-3 text-xs"
                  onClick={() => handleCreateRojnama(hearing)}
                >
                  Create Rojnama
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() =>
                    navigate(`/steno/cases/${hearing.case.id}/rojnamas`)
                  }
                  className="min-h-9 rounded px-3 text-xs"
                >
                  Records
                </Button>
              </div>
            )}
          />
        </Card>
      </section>
    </div>
  );
}

export default StenoDashboard;
