import styles from "@/app/page.module.css";

export default async function Home() {
  return (
    <section className={styles.hero}>
      <h1>Next.js + Encore Web App Starter</h1>

      <div className={styles.grid}>
        <a
          href="https://encore.dev/docs"
          className={styles.card}
          target="_blank"
        >
          <h2>
            Encore Docs <span>-&gt;</span>
          </h2>
          <p>
            Learn how to build cloud backends using the Encore´s Development
            Platform.
          </p>
        </a>

        <a
          href="https://nextjs.org/docs"
          className={styles.card}
          target="_blank"
        >
          <h2>
            Next.js Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a href="http://localhost:9400" className={styles.card} target="_blank">
          <h2>
            Local Dev Dash <span>-&gt;</span>
          </h2>
          <p>
            Access Encore's local development dashboard when running Encore
            locally.
          </p>
        </a>

        <a
          href="https://encore.dev/docs/deploy/deploying"
          className={styles.card}
          target="_blank"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>Learn how to deploy your Encore application.</p>
        </a>
      </div>
    </section>
  );
}
