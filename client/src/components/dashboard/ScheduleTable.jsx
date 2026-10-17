const statusStyles = {
  Upcoming: "bg-blue-100 text-blue-800",
  Ongoing: "bg-amber-100 text-amber-800",
  Scheduled: "bg-slate-100 text-slate-700",
  Completed: "bg-green-100 text-green-800",
};

// ScheduleTable renders hearings in a compact, responsive dashboard table.
function ScheduleTable({ hearings = [], renderActions, compact = false }) {
  const hasActions = typeof renderActions === "function";

  if (hearings.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-brand-muted">
        No hearings today
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full min-w-[640px] text-left ${compact ? "text-[0.58rem]" : "text-sm"}`}>
        <thead className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-muted">
          <tr>
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>Time</th>
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>Case Number</th>
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>Title</th>
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>Type</th>
            <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>Status</th>
            {hasActions ? <th className={`${compact ? "px-2 py-2" : "px-5 py-3"} font-bold`}>Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {hearings.map((hearing) => (
            <tr key={hearing.id} className="align-top">
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap font-semibold text-brand-navy`}>
                {hearing.time}
              </td>
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap text-brand-navy`}>
                {hearing.case.caseNumber}
              </td>
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} max-w-xs text-brand-gray`}>
                {hearing.case.title}
              </td>
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap text-brand-gray`}>
                {hearing.case.caseType}
              </td>
              <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap`}>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[0.55rem] font-bold ${statusStyles[hearing.status] || "bg-slate-100 text-slate-700"}`}
                >
                  {hearing.status}
                </span>
              </td>
              {hasActions ? (
                <td className={`${compact ? "px-2 py-2" : "px-5 py-4"} whitespace-nowrap`}>
                  {renderActions(hearing)}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
