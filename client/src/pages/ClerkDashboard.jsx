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

function ClerkDashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { schedule, stats, status, error } = useSelector(
    (state) => state.hearings,
  );

  // Load the clerk's scoped schedule and statistics when the page mounts.
  useEffect(() => {
    dispatch(fetchSchedule());
    dispatch(fetchStats());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-[var(--color-accent)]">
          Clerk dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-navy md:text-3xl">
          Welcome, {user?.name || "Clerk"}
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

      <section aria-labelledby="schedule-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              id="schedule-heading"
              className="text-xl font-bold text-brand-navy"
            >
              Today&apos;s Schedule
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Hearings assigned to your court
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
              <div className="flex max-w-full flex-wrap gap-1">
                {["View", "Edit", "AI Brief"].map((label) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="md"
                    disabled
                    title="Coming soon"
                    className="min-h-8 px-2 text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
          />
        </Card>
      </section>
    </div>
  );
}

export default ClerkDashboard;
