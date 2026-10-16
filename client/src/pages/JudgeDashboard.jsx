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
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-[var(--color-accent)]">
          Judge dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy md:text-3xl">
          Welcome, {user?.name || "Judge"}
        </h1>
      </header>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Today's statistics"
      >
        <StatCard label="Total today" value={stats?.totalToday ?? "-"} />
        <StatCard label="Completed" value={stats?.completed ?? "-"} />
        <StatCard label="Upcoming" value={stats?.upcoming ?? "-"} />
        <StatCard label="Pending cases" value={stats?.pendingCases ?? "-"} />
      </section>

      <section aria-labelledby="hearings-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              id="hearings-heading"
              className="text-xl font-bold text-brand-navy"
            >
              Today&apos;s Hearings
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Hearings assigned to you
            </p>
          </div>
          {isLoading ? (
            <p className="text-sm text-brand-muted">Loading...</p>
          ) : null}
        </div>
        <Card className="overflow-hidden">
          <ScheduleTable
            hearings={schedule}
            renderActions={() => (
              <Button
                variant="outline"
                size="md"
                disabled
                title="Coming soon"
              >
                AI Brief
              </Button>
            )}
          />
        </Card>
      </section>
    </div>
  );
}

export default JudgeDashboard;
