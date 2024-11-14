import {FC} from "react";

export default async function Home() {
  return (
    <section className="flex w-full flex-col justify-center items-center">
      <h1 className="text-5xl mb-20">Next.js + Encore Web App Starter</h1>

      <div className="grid grid-cols-4 max-w-6xl">
        <Card
          href="https://encore.dev/docs"
          heading="Encore Docs"
          desc="Learn how to build cloud backends using the Encore´s Development Platform."
        />

        <Card
          href="https://nextjs.org/docs"
          heading="Next.js Docs"
          desc="Find in-depth information about Next.js features and API."
        />

        <Card
          href="http://localhost:9400"
          heading="Local Dev Dash"
          desc="Access Encore's local development dashboard when running Encore locally."
        />

        <Card
          href="https://encore.dev/docs/deploy/deploying"
          heading="Deploy"
          desc="Learn how to deploy your Encore application."
        />
      </div>
    </section>
  );
}

const Card: FC<{ href: string; heading: string; desc: string }> = ({href, heading, desc}) => {
  return <a href={href} className="group p-4 bg-white bg-opacity-0 transition hover:bg-black hover:bg-opacity-5" target="_blank">
    <h2 className="mb-2 font-semibold">{heading} <span className="inline-block transition group-hover:translate-x-2">-&gt;</span></h2>
    <p className="opacity-60">{desc}</p>
  </a>
}
