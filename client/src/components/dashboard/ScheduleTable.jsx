const statusStyles = {
  Upcoming: "bg-blue-100 text-blue-800",
  Ongoing: "bg-amber-100 text-amber-800",
  Scheduled: "bg-slate-100 text-slate-700",
  Completed: "bg-green-100 text-green-800",
};

// ScheduleTable renders hearings in a compact, responsive dashboard table.
function ScheduleTable({ hearings = [], renderActions }) {
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
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-muted">
          <tr>
            <th className="px-5 py-3 font-bold">Time</th>
            <th className="px-5 py-3 font-bold">Case Number</th>
            <th className="px-5 py-3 font-bold">Title</th>
            <th className="px-5 py-3 font-bold">Type</th>
            <th className="px-5 py-3 font-bold">Status</th>
            {hasActions ? <th className="px-5 py-3 font-bold">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {hearings.map((hearing) => (
            <tr key={hearing.id} className="align-top">
              <td className="whitespace-nowrap px-5 py-4 font-semibold text-brand-navy">
                {hearing.time}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-brand-navy">
                {hearing.case.caseNumber}
              </td>
              <td className="max-w-xs px-5 py-4 text-brand-gray">
                {hearing.case.title}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-brand-gray">
                {hearing.case.caseType}
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[hearing.status] || "bg-slate-100 text-slate-700"}`}
                >
                  {hearing.status}
                </span>
              </td>
              {hasActions ? (
                <td className="whitespace-nowrap px-5 py-4">
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
