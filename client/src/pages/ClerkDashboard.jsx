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
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-brand-navy">
          Good Morning, {user?.name || "Clerk"}
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Overview of today&apos;s court proceedings <span className="mx-1">•</span>{" "}
          {new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </p>
      </header>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <section
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Today's statistics"
      >
        <StatCard dashboard icon="▣" label="Total Cases Today" value={stats?.totalToday ?? "-"} hint="Cases scheduled for hearing" />
        <StatCard dashboard icon="▤" variant="orange" label="Pending Updates" value={stats?.pendingCases ?? "-"} hint="Rojnama records need to be updated" />
        <StatCard dashboard icon="●" variant="green" label="Completed Hearings" value={stats?.completed ?? "-"} hint="Hearings completed today" />
        <StatCard dashboard icon="!" variant="red" label="Next Date Pending" value={stats?.upcoming ?? "-"} hint="Cases require next-date recording" />
      </section>

      <section aria-labelledby="schedule-heading">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <h2
              id="schedule-heading"
              className="text-xl font-bold text-brand-navy"
            >
              Today&apos;s Schedule
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Select a hearing to view or update Rojnama
            </p>
          </div>
          {isLoading ? (
            <p className="text-sm text-brand-muted">Loading...</p>
          ) : null}
        </div>
        <Card className="overflow-hidden rounded-lg">
          <ScheduleTable
            hearings={schedule}
            displayMode="clerk"
            renderActions={() => (
              <div className="flex max-w-full flex-wrap gap-1">
                {["View", "Edit"].map((label) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="md"
                    disabled
                    title="Coming soon"
                    className="min-h-9 px-3 text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
          />
        </Card>
      </section>
      <Card className="p-5">
        <h2 className="text-lg font-bold text-brand-navy">Pending Clerk Actions</h2>
        <div className="mt-3 flex max-w-xl items-center gap-4 rounded-lg border border-[#f5d6d8] bg-[#fff8f8] p-4 text-brand-error">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ffe2e5] text-lg">
            ▤
          </span>
          <div>
            <p className="text-2xl font-bold">{stats?.pendingCases ?? "-"}</p>
            <strong className="block text-sm">Rojnama records need updating</strong>
            <span className="text-xs text-brand-muted">
              Hearing records from stenographers are pending entry or update
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ClerkDashboard;
