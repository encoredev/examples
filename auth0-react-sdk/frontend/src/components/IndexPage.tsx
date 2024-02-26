import "./IndexPage.css";

function IndexPage() {
  return (
    <div className="IndexPage">
      <h1>React + Encore Web App Starter</h1>

      <div className="grid">
        <a href="https://encore.dev/docs" className="card" target="_blank">
          <h2>
            Encore Docs <span>-&gt;</span>
          </h2>
          <p>
            Learn how to build cloud backends using the Encore´s Development
            Platform.
          </p>
        </a>

        <a href="https://react.dev/" className="card" target="_blank">
          <h2>
            React Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about React features and API.</p>
        </a>

        <a href="http://localhost:9400" className="card" target="_blank">
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
          className="card"
          target="_blank"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>Learn how to deploy your Encore application.</p>
        </a>
      </div>
    </div>
  );
}

export default IndexPage;
