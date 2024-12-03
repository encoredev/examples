import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Encore + Remix" },
    { name: "description", content: "Encore + Remix" },
  ];
};

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-24">
      <h1 className="text-3xl font-light px-5 mb-24">Remix + Encore Web App Starter</h1>

      <div className="grid grid-cols-3 gap-4 max-w-full w-[1000px]">
        <a
          href="https://encore.dev/docs"
          className="group rounded p-4 bg-white/0 dark:bg-dark/0 transition-all duration-200 text-inherit no-underline hover:bg-black/5 dark:hover:bg-white/5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="font-semibold mb-2">
            Encore Docs <span
            className="inline-block transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 text-opacity-60 text-sm leading-6">
            Learn how to build cloud backends using the Encore’s Development Platform.
          </p>
        </a>

        <a
          href="https://react.dev/"
          className="group rounded p-4 bg-white/0 dark:bg-dark/0 transition-all duration-200 text-inherit no-underline hover:bg-black/5 dark:hover:bg-white/5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="font-semibold mb-2">
            React Docs <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 text-opacity-60 text-sm leading-6">
            Find in-depth information about React features and API.
          </p>
        </a>

        <a
          href="https://remix.run/"
          className="group rounded p-4 bg-white/0 dark:bg-dark/0 transition-all duration-200 text-inherit no-underline hover:bg-black/5 dark:hover:bg-white/5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="font-semibold mb-2">
            Remix Docs <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 text-opacity-60 text-sm leading-6">
            Find in-depth information about Remix features and API.
          </p>
        </a>

        <a
          href="http://localhost:9400"
          className="group rounded p-4 bg-white/0 dark:bg-dark/0 transition-all duration-200 text-inherit no-underline hover:bg-black/5 dark:hover:bg-white/5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="font-semibold mb-2">
            Local Dev Dash <span
            className="inline-block transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 text-opacity-60 text-sm leading-6">
            Access Encore's local development dashboard when running Encore locally.
          </p>
        </a>

        <a
          href="https://encore.dev/docs/deploy/deploying"
          className="group rounded p-4 bg-white/0 dark:bg-dark/0 transition-all duration-200 text-inherit no-underline hover:bg-black/5 dark:hover:bg-white/5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="font-semibold mb-2">
            Deploy <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 text-opacity-60 text-sm leading-6">
            Learn how to deploy your Encore application.
          </p>
        </a>
      </div>
    </div>

  );
}
