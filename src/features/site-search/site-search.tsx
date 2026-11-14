"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMachine } from "@xstate/react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import type { PageSource } from "@/entities/page";
import type { Dictionary } from "@/modules/i18n";
import { pagePath } from "@/server/pages";
import { Button } from "@/ui/components/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/ui/components/dialog";
import { Input } from "@/ui/components/input";
import { siteSearchMachine } from "./machine";

interface SiteSearchProps {
  labels: Dictionary["search"];
  source: PageSource;
}

// Cmd/Ctrl+K page search. The machine owns the flow (open, debounce, search,
// retry) and reads hits through the query cache; this component renders its
// state and sends it events.
export const SiteSearch = ({ labels, source }: SiteSearchProps) => {
  const queryClient = useQueryClient();
  const [snapshot, send] = useMachine(siteSearchMachine, { input: { queryClient, source } });
  const { query, hits } = snapshot.context;
  const showsResults = snapshot.matches({ open: "results" });

  // A global shortcut is a subscription to the outside world, which is what
  // an effect is for.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        send({ type: "OPEN" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [send]);

  return (
    <Dialog
      onOpenChange={(open) => {
        send({ type: open ? "OPEN" : "CLOSE" });
      }}
      open={!snapshot.matches("closed")}
    >
      <DialogTrigger render={<Button size="icon" variant="ghost" />}>
        <SearchIcon aria-hidden />
        <span className="sr-only">{labels.trigger}</span>
      </DialogTrigger>
      <DialogContent className="gap-4">
        <DialogTitle>{labels.title}</DialogTitle>
        <Input
          aria-label={labels.title}
          autoFocus
          onChange={(event) => {
            send({ type: "TYPE", query: event.target.value });
          }}
          placeholder={labels.placeholder}
          type="search"
          value={query}
        />
        <div aria-live="polite" className="min-h-10 text-muted-foreground text-sm">
          {snapshot.matches({ open: "searching" }) ? <p>{labels.searching}</p> : null}
          {snapshot.matches({ open: "failure" }) ? (
            <p className="flex items-center justify-between gap-4">
              {labels.failed}
              <Button
                onClick={() => {
                  send({ type: "RETRY" });
                }}
                size="sm"
                variant="outline"
              >
                {labels.retry}
              </Button>
            </p>
          ) : null}
          {showsResults && hits.length === 0 ? <p>{labels.empty}</p> : null}
          {showsResults && hits.length > 0 ? (
            <ul className="-mx-2 grid gap-1">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <Link
                    className="block rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                    href={pagePath(hit.slug)}
                    onClick={() => {
                      send({ type: "CLOSE" });
                    }}
                  >
                    {hit.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
