import type { MvpProgramDefinition } from "@/lib/mvp-programs";

export function MvpProgramDetails({ program }: { program: MvpProgramDefinition }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd60a]">
          {program.badge}
        </p>
        <h2 className="mt-2 text-xl font-bold leading-snug text-[#f8fafc] sm:text-2xl">
          {program.headline}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#94a3b8]">{program.intro}</p>
      </div>

      <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.5)] p-5 sm:p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#ffd60a]">
          {program.proIncludesTitle}
        </h3>
        <ul className="mt-3 space-y-2">
          {program.proIncludes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#f8fafc]/90">
              <span className="mt-0.5 font-bold text-[#ffd60a]" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.5)] p-5">
          <h3 className="text-sm font-bold text-[#f8fafc]">{program.youGetTitle}</h3>
          <ul className="mt-3 space-y-2">
            {program.youGet.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                <span className="mt-0.5 font-bold text-[#ffd60a]" aria-hidden>
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.5)] p-5">
          <h3 className="text-sm font-bold text-[#f8fafc]">{program.weAskTitle}</h3>
          <ul className="mt-3 space-y-2">
            {program.weAsk.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                <span className="mt-0.5 font-bold text-[#ffd60a]" aria-hidden>
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {program.extensionTiers && program.extensionTiers.length > 0 ? (
        <div>
          <h3 className="text-sm font-bold text-[#f8fafc]">Earn more free Pro time</h3>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Hit milestones to extend access — rules are published, not vague.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[rgba(148,163,184,0.18)]">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.8)]">
                  <th className="px-4 py-3 font-semibold text-[#ffd60a]">Tier</th>
                  <th className="px-4 py-3 font-semibold text-[#f8fafc]">You do</th>
                  <th className="px-4 py-3 font-semibold text-[#f8fafc]">You get</th>
                </tr>
              </thead>
              <tbody>
                {program.extensionTiers.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-[rgba(148,163,184,0.12)] last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-[#f8fafc]">{row.label}</td>
                    <td className="px-4 py-3 text-[#94a3b8]">{row.contribution}</td>
                    <td className="px-4 py-3 text-[#f8fafc]/90">{row.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {program.extensionNote ? (
            <p className="mt-3 text-xs leading-relaxed text-[#94a3b8]">{program.extensionNote}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-3 rounded-xl border border-[#ffd60a]/25 bg-[#ffd60a]/[0.06] p-5 text-sm">
        <p className="text-[#f8fafc]/90">
          <span className="font-semibold text-[#f8fafc]">After your access: </span>
          {program.afterProgram}
        </p>
        <p className="text-[#94a3b8]">
          <span className="font-semibold text-[#f8fafc]">Before we open: </span>
          {program.earlyAccessNote}
        </p>
        <p className="text-xs text-[#94a3b8]/90">{program.notFitFor}</p>
      </div>
    </div>
  );
}
