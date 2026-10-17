import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScheduleTable from "../components/dashboard/ScheduleTable.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { useAuth } from "../features/auth/useAuth.js";
import {
  fetchSchedule,
  fetchStats,
} from "../features/hearings/hearingSlice.js";

function JudgeDashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { schedule, stats, status, error } = useSelector(
    (state) => state.hearings,
  );

  // Load the judge's scoped schedule and statistics when the page mounts.
  useEffect(() => {
    dispatch(fetchSchedule());
    dispatch(fetchStats());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-brand-navy">
          Good Morning, {user?.name || "Judge"}
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Today&apos;s Hearings <span className="mx-1">•</span>{" "}
          {new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </p>
      </header>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <section
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        aria-label="Today's statistics"
      >
        <StatCard dashboard icon="▣" label="Total Cases Today" value={stats?.totalToday ?? "-"} hint="Cases scheduled for hearing" />
        <StatCard dashboard icon="▤" variant="orange" label="Pending Cases" value={stats?.pendingCases ?? "-"} hint="Cases awaiting proceedings" />
        <StatCard dashboard icon="●" variant="green" label="Completed Cases" value={stats?.completed ?? "-"} hint="Hearings completed today" />
      </section>

      <section aria-labelledby="hearings-heading">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <h2
              id="hearings-heading"
              className="text-xl font-bold text-brand-navy"
            >
              Today&apos;s Hearings
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Review today&apos;s scheduled hearings
            </p>
          </div>
          {isLoading ? (
            <p className="text-sm text-brand-muted">Loading...</p>
          ) : null}
        </div>
        <Card className="overflow-hidden rounded-lg">
          <ScheduleTable
            hearings={schedule}
            displayMode="judge"
            renderActions={() => (
              <Button
                variant="outline"
                size="md"
                disabled
                title="Coming soon"
                className="min-h-9 bg-brand-blue text-white hover:bg-brand-blue-dark"
              >
                AI Brief
              </Button>
            )}
          />
        </Card>
      </section>
      <div className="flex items-start gap-4 rounded-lg border border-[#cfe5fb] bg-[#eaf4ff] p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-blue text-xl font-bold text-white">
          i
        </span>
        <div>
          <strong className="text-lg text-brand-navy">Hearing Overview</strong>
          <p className="mt-1 text-sm text-[#607b9d]">
            Select View to review the case summary, procedural history, relevant laws and precedents before the hearing.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JudgeDashboard;
