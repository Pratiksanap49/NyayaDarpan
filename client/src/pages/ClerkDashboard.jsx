import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
import { fetchPendingRojnamas } from "../features/rojnama/rojnamaSlice.js";
import { getGreeting } from "../utils/greeting.js";


const dateKey = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ].join("-");
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
};

function ClerkDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { schedule, stats, status, error } = useSelector(
    (state) => state.hearings,
  );
  const { pending, pendingStatus, pendingError } = useSelector(
    (state) => state.rojnama,
  );

  // Load the clerk's scoped schedule and statistics when the page mounts.
  useEffect(() => {
    dispatch(fetchSchedule());
    dispatch(fetchStats());
    dispatch(fetchPendingRojnamas());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";
  const pendingByHearing = new Map(
    pending
      .filter((rojnama) => dateKey(rojnama.hearingDate) === dateKey(new Date()))
      .map((rojnama) => [
        `${rojnama.caseId?._id}-${dateKey(rojnama.hearingDate)}`,
        rojnama,
      ]),
  );
  const scheduleWithRojnamas = schedule.map((hearing) => {
    const rojnama = pendingByHearing.get(
      `${hearing.case.id}-${dateKey(new Date())}`,
    );

    return {
      ...hearing,
      rojnamaId: rojnama?._id,
      rojnamaStatus: rojnama?.status,
    };
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-brand-navy">
          {getGreeting()}, {user?.name || "-"}
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
            hearings={scheduleWithRojnamas}
            displayMode="clerk"
            renderActions={(hearing) => (
              <div className="flex max-w-full flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="md"
                  disabled={!hearing.rojnamaId}
                  title={
                    hearing.rojnamaId
                      ? "View pending Rojnama"
                      : "No pending Rojnama for this hearing"
                  }
                  className="min-h-9 px-3 text-xs"
                  onClick={() =>
                    navigate(`/clerk/rojnama/${hearing.rojnamaId}`)
                  }
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  disabled
                  title="Clerk editing is not available"
                  className="min-h-9 px-3 text-xs"
                >
                  Edit
                </Button>
              </div>
            )}
          />
        </Card>
      </section>
      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-brand-navy">
            Pending Clerk Actions
          </h2>
          <Link
            to="/clerk/pending"
            className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        {pendingError ? (
          <div className="mt-3">
            <Alert variant="error">{pendingError}</Alert>
          </div>
        ) : pendingStatus === "loading" || pendingStatus === "idle" ? (
          <p className="mt-3 text-sm text-brand-muted">Loading pending Rojnamas...</p>
        ) : pending.length === 0 ? (
          <p className="mt-3 text-sm text-brand-muted">No pending Rojnamas</p>
        ) : (
          <div className="mt-3 divide-y divide-brand-border">
            {pending.map((rojnama) => (
              <button
                key={rojnama._id}
                type="button"
                className="flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left hover:bg-slate-50"
                onClick={() => navigate(`/clerk/rojnama/${rojnama._id}`)}
              >
                <span className="min-w-0">
                  <strong className="block text-sm text-brand-navy">
                    {rojnama.caseId?.caseNumber || "-"}
                  </strong>
                  <span className="block truncate text-sm text-brand-gray">
                    {rojnama.caseId?.title || "-"}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-brand-muted">
                  {formatDate(rojnama.hearingDate)}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default ClerkDashboard;
