"use client";

/**
 * The admin's view: visitors to the site, accounts, and who is connected to
 * AskSEO over MCP. The numbers come from the auth service
 * (`GET /api/admin/overview`), which answers only a verified account named in
 * its `ADMIN_EMAILS`; everyone else sees "admins only". The page itself holds
 * no data, so it is safe in a static export.
 */

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth/client";

interface Overview {
  readonly site: { views_1d: number; visitors_1d: number; views_30d: number; views_all: number };
  readonly daily: readonly { day: string; views: number; visitors: number }[];
  readonly topPages: readonly { path: string; views: number }[];
  readonly referrers: readonly { referrer: string; views: number }[];
  readonly users: { users: number; verified: number; new_7d: number };
  readonly mcp: {
    people: number;
    connections: readonly { name: string; email: string; client: string | null; connected_at: string }[];
  };
}

type State = { kind: "loading" } | { kind: "denied" } | { kind: "error" } | { kind: "ready"; data: Overview };

const number = new Intl.NumberFormat("en");

function Stat({ label, value, note }: { label: string; value: number; note?: string }): React.ReactElement {
  return (
    <Card className="gap-1 py-4">
      <CardContent className="px-4">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{number.format(value)}</p>
        {note !== undefined ? <p className="text-muted-foreground text-xs">{note}</p> : null}
      </CardContent>
    </Card>
  );
}

/** Daily unique visitors, last 30 days: one series, so no legend; the title names it. */
function DailyVisitors({ daily: recorded }: { daily: Overview["daily"] }): React.ReactElement {
  // Every one of the last 30 days gets a slot, so a quiet day shows as a gap
  // rather than the remaining days stretching to fill the width.
  const byDay = new Map(recorded.map((d) => [d.day, d]));
  const daily = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(Date.now() - (29 - i) * 86_400_000).toISOString().slice(0, 10);
    return byDay.get(day) ?? { day, views: 0, visitors: 0 };
  });
  const max = Math.max(1, ...daily.map((d) => d.visitors));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Unique visitors per day, last 30 days</CardTitle>
      </CardHeader>
      <CardContent>
        {recorded.length === 0 ? (
          <p className="text-muted-foreground text-sm">No visits recorded yet.</p>
        ) : (
          <>
            <div className="flex h-40 items-end gap-[2px] border-b" role="img" aria-label="Unique visitors per day">
              {daily.map((d) => (
                <div
                  key={d.day}
                  className="group relative flex h-full flex-1 items-end"
                  title={`${d.day}: ${d.visitors} visitors, ${d.views} page views`}
                >
                  <div
                    className="bg-fd-primary w-full rounded-t-[4px] group-hover:opacity-80"
                    style={{ height: d.visitors === 0 ? 0 : `${Math.max(2, (d.visitors / max) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="text-muted-foreground mt-1 flex justify-between text-xs">
              <span>{daily[0]?.day}</span>
              <span>Peak {number.format(max)}</span>
              <span>{daily.at(-1)?.day}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Table({
  title,
  head,
  rows,
  empty,
}: {
  title: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
  empty: string;
}): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{empty}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left text-xs">
                {head.map((h) => (
                  <th key={h} className="pb-2 pr-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 pr-4 break-all">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminPage(): React.ReactElement {
  const { data: session, isPending } = useSession();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (isPending) return;
    if (session === null || session === undefined) {
      window.location.assign("/sign-in");
      return;
    }
    void fetch("/api/admin/overview", { credentials: "same-origin" })
      .then(async (response) => {
        if (response.status === 403) return setState({ kind: "denied" });
        if (!response.ok) return setState({ kind: "error" });
        setState({ kind: "ready", data: (await response.json()) as Overview });
      })
      .catch(() => setState({ kind: "error" }));
  }, [isPending, session]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">AskSEO admin</h1>
      {state.kind === "loading" ? <p className="text-muted-foreground">Loading...</p> : null}
      {state.kind === "denied" ? (
        <p>This page is for AskSEO admins only. You are signed in as {session?.user.email}.</p>
      ) : null}
      {state.kind === "error" ? <p className="text-destructive">Could not load the numbers. Try again.</p> : null}
      {state.kind === "ready" ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Visitors today" value={state.data.site.visitors_1d} note={`${number.format(state.data.site.views_1d)} page views`} />
            <Stat label="Page views, 30 days" value={state.data.site.views_30d} note={`${number.format(state.data.site.views_all)} all time`} />
            <Stat label="Accounts" value={state.data.users.users} note={`${number.format(state.data.users.new_7d)} new this week`} />
            <Stat label="People connected over MCP" value={state.data.mcp.people} note={`${number.format(state.data.mcp.connections.length)} connections`} />
          </div>
          <DailyVisitors daily={state.data.daily} />
          <Table
            title="Connected over MCP"
            head={["Name", "Email", "Assistant", "Connected"]}
            rows={state.data.mcp.connections.map((c) => [
              c.name,
              c.email,
              c.client ?? "Unknown",
              new Date(c.connected_at).toLocaleString(),
            ])}
            empty="Nobody has connected an assistant yet."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Table
              title="Top pages, 30 days"
              head={["Page", "Views"]}
              rows={state.data.topPages.map((p) => [p.path, number.format(p.views)])}
              empty="No visits recorded yet."
            />
            <Table
              title="Where visitors came from, 30 days"
              head={["Site", "Views"]}
              rows={state.data.referrers.map((r) => [r.referrer, number.format(r.views)])}
              empty="No referrers recorded yet."
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
