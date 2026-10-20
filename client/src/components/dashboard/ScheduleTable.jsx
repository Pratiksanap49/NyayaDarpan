const statusStyles = {
  Upcoming: "bg-blue-100 text-blue-800",
  Ongoing: "bg-amber-100 text-amber-800",
  Scheduled: "bg-slate-100 text-slate-700",
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-amber-100 text-amber-800",
  Updated: "bg-green-100 text-green-800",
  submitted: "bg-blue-100 text-blue-800",
  needs_correction: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
};

// ScheduleTable renders hearings in a compact, responsive dashboard table.
function ScheduleTable({
  hearings = [],
  renderActions,
  compact = false,
  displayMode = "default",
}) {
  const hasActions = typeof renderActions === "function";
  const isClerk = displayMode === "clerk";
  const isJudge = displayMode === "judge";

  if (hearings.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-brand-muted">
        No hearings today
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`w-full min-w-[640px] text-left ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <thead className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-muted">
          <tr>
            {isClerk || isJudge ? (
              <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
                #
              </th>
            ) : null}
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
              Time
            </th>
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
              Case Number
            </th>
            {!isJudge && (
              <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
                {isClerk ? "Case Title" : "Title"}
              </th>
            )}
            {!isJudge && !isClerk ? (
              <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
                Type
              </th>
            ) : null}
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
              {isJudge || isClerk ? "Case Status" : "Status"}
            </th>
            {isClerk ? (
              <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
                Rojnama Status
              </th>
            ) : null}
            {hasActions ? (
              <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
                {isJudge ? "AI Brief" : isClerk ? "Action" : "Actions"}
              </th>
            ) : null}
            {isClerk ? (
              <>
                <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
                  AI Brief
                </th>
                <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>
                  Send
                </th>
              </>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {hearings.map((hearing) => (
            <tr key={hearing.id} className="align-top transition-colors hover:bg-slate-50">
              {isClerk || isJudge ? (
                <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} text-center text-brand-gray`}>
                  {hearings.indexOf(hearing) + 1}
                </td>
              ) : null}
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap font-semibold text-brand-navy`}>
                {hearing.time}
              </td>
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap text-brand-navy`}>
                {hearing.case.caseNumber}
              </td>
              {!isJudge && (
                <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} max-w-xs text-brand-gray`}>
                  {hearing.case.title}
                </td>
              )}
              {!isJudge && !isClerk ? (
                <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap text-brand-gray`}>
                  {hearing.case.caseType}
                </td>
              ) : null}
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap`}>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${statusStyles[hearing.status] || "bg-slate-100 text-slate-700"}`}
                >
                  {hearing.status}
                </span>
              </td>
              {isClerk ? (
                <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap`}>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${
                      hearing.rojnamaStatus
                        ? statusStyles[hearing.rojnamaStatus]
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {hearing.rojnamaStatus || "—"}
                  </span>
                </td>
              ) : null}
              {hasActions ? (
                <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap`}>
                  {renderActions(hearing)}
                </td>
              ) : null}
              {isClerk ? (
                <>
                  <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap`}>
                    <button
                      type="button"
                      disabled
                      title="Coming soon"
                      className="min-h-9 rounded-md bg-brand-blue px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      AI Brief
                    </button>
                  </td>
                  <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap`}>
                    <button
                      type="button"
                      disabled
                      title="Coming soon"
                      className="min-h-9 min-w-9 rounded-md border border-[#cde9e3] bg-[#effbf8] px-2 text-base font-bold text-[#168c76] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      →
                    </button>
                  </td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
