import { useState } from "react";
import { TranscriptDetails } from "./components/TranscriptDetails";
import { TranscriptList } from "./components/TranscriptList";
import { UploadAudioForm } from "./components/UploadAudioForm";

function App() {
  const [transcriptId, setTranscriptId] = useState<string>();

  return (
    <div className="grid grid-cols-[1fr_3fr] min-h-full divide-x">
      <aside
        className="flex flex-col bg-gray-50 divide-y"
        style={{ height: "100vh" }}
      >
        <UploadAudioForm />
        <TranscriptList selected={transcriptId} onSelect={setTranscriptId} />
      </aside>
      <main className="overflow-y-scroll" style={{ height: "100vh" }}>
        {transcriptId && <TranscriptDetails id={transcriptId} />}
      </main>
    </div>
  );
}

export default App;
