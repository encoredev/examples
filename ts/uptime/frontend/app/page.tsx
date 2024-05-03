"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Client, { monitor, site } from "@/app/lib/client";
import { FC, useEffect, useState } from "react";
import { DateTime } from "luxon";

function App() {
  const [baseURL, setBaseURL] = useState("");
  useEffect(() => setBaseURL(window.location.origin), []);

  if (!baseURL) return null;

  return (
    <>
      <div className="min-h-full container px-4 mx-auto my-16">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Uptime Monitoring
        </h2>

        <main className="pt-8 pb-16">
          <SiteList client={new Client(baseURL)} />
        </main>
      </div>
    </>
  );
}

const SiteList: FC<{ client: Client }> = ({ client }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["sites"],
    queryFn: () => client.site.list(),
    refetchInterval: 10000, // 10s
    retry: false,
  });

  const { data: status } = useQuery({
    queryKey: ["status"],
    queryFn: () => client.monitor.status(),
    refetchInterval: 1000, // every second
    retry: false,
  });

  const queryClient = useQueryClient();

  const doDelete = useMutation({
    mutationFn: (site: site.Site) => {
      return client.site.del(site.id, { id: site.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div className="text-red-600">{(error as Error).message}</div>;
  }

  const now = DateTime.now();
  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Monitored Websites
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the websites being monitored, their current status,
            and when they were last checked.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <AddSiteForm client={client} />
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Site
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.sites.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className={"text-center text-gray-400 py-8"}
                      >
                        Nothing to monitor yet. Add a website to see it here.
                      </td>
                    </tr>
                  )}
                  {data!.sites.map((site) => {
                    const st = status?.sites.find((s) => s.id === site.id);
                    const dt = st && DateTime.fromISO(st.checkedAt);
                    return (
                      <tr key={site.id}>
                        <td className="px-3 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">{site.url}</span>
                            <StatusBadge status={st} />
                          </div>
                          {dt && (
                            <div className="text-gray-400">
                              Last checked <TimeDelta dt={dt} />
                            </div>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => doDelete.mutate(site)}
                          >
                            Delete<span className="sr-only"> {site.url}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AddSiteForm: FC<{ client: Client }> = ({ client }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [url, setUrl] = useState("");

  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: async (url: string) => {
      if (!validURL(url)) {
        return;
      }

      await client.site.add({ url });
      setFormOpen(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save.mutate(url);
  };

  if (!formOpen) {
    return (
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        onClick={() => setFormOpen(true)}
      >
        Add website
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="google.com"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm enabled:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
            disabled={!validURL(url)}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default App;

const validURL = (url: string) => {
  const idx = url.lastIndexOf(".");
  if (idx === -1 || url.substring(idx + 1) === "") {
    return false;
  }

  if (!url.startsWith("http:") && !url.startsWith("https:")) {
    url = "https://" + url;
  }

  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
};

const StatusBadge: FC<{ status: monitor.SiteStatus | undefined }> = ({
  status,
}) => {
  const up = status?.up;
  return up ? (
    <Badge color="green">Up</Badge>
  ) : up === false ? (
    <Badge color="red">Down</Badge>
  ) : (
    <Badge color="gray">Unknown</Badge>
  );
};

const Badge: FC<{
  color: "green" | "red" | "orange" | "gray";
  children?: React.ReactNode;
}> = ({ color, children }) => {
  const [bgColor, textColor] = {
    green: ["bg-green-100", "text-green-800"],
    red: ["bg-red-100", "text-red-800"],
    orange: ["bg-orange-100", "text-orange-800"],
    gray: ["bg-gray-100", "text-gray-800"],
  }[color]!;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium uppercase ${bgColor} ${textColor}`}
    >
      {children}
    </span>
  );
};

const TimeDelta: FC<{ dt: DateTime }> = ({ dt }) => {
  const compute = () => dt.toRelative();
  const [str, setStr] = useState(compute());

  useEffect(() => {
    const handler = () => setStr(compute());
    const timer = setInterval(handler, 1000);
    return () => clearInterval(timer);
  }, [dt]);

  return <>{str}</>;
};
