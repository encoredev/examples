function IndexPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <div className="p-10 text-center">
        <h1 className="text-4xl mb-4">Encore.ts Streaming Examples</h1>
        <p className="text-center">
          This example showcases the different{" "}
          <a
            href="https://encore.dev/docs/ts/primitives/streaming-apis"
            className="underline"
          >
            WebSocket streaming APIs
          </a>{" "}
          in Encore.ts.
        </p>
        <p>Pick an example from the header navigation.</p>
        <p className="text-center">
          View the full code in the{" "}
          <a
            href="https://github.com/encoredev/examples/tree/main/ts"
            className="underline"
          >
            example repo on GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default IndexPage;
