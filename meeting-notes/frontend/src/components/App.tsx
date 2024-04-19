import { useEffect, useState } from "react";
import { MilkdownProvider } from "@milkdown/react";
import { FloppyDisk, Image } from "@phosphor-icons/react";
import Client, { Environment, Local } from "../client";
import { v4 as uuidv4 } from "uuid";
import CoverSelector from "./CoverSelector.tsx";
import MarkdownEditor from "./MarkdownEditor.tsx";
import SharingModal from "./SharingModal.tsx";

/**
 * Returns the Encore request client for either the local or staging environment.
 * If we are running the frontend locally (dev mode) we assume that our Encore backend is also running locally
 * and make requests to that, otherwise we use the staging client.
 */
const getRequestClient = () => {
  return import.meta.env.DEV
    ? new Client(Local)
    : new Client(Environment("staging"));
};

function App() {
  // Get the request client to make requests to the Encore backend
  const client = getRequestClient();

  const urlParams = new URLSearchParams(window.location.search);
  const queryParamID = urlParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState<string>("");

  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      // If we do not have an id then we are creating a new note, nothing needs to be fetched
      if (!queryParamID) {
        setIsLoading(false);
        return;
      }
      try {
        // Fetch the note from the backend
        const response = await client.note.GetNote(queryParamID);
        setCoverImage(response.cover_url || "");
        setContent(response.text || "");
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };
    fetchNote();
  }, []);

  const saveDocument = async () => {
    try {
      // Send POST request to the backend for saving the note
      const response = await client.note.SaveNote({
        text: content,
        cover_url: coverImage,
        // If we have an id then we are updating an existing note, otherwise we are creating a new one
        id: queryParamID || uuidv4(),
      });

      // Append the id to the url
      const url = new URL(window.location.href);
      url.searchParams.set("id", response.id);
      window.history.pushState(null, "", url.toString());

      // We now have saved note with an ID, we can now show the sharing modal
      setShowSharingModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-full">
      <div
        className={` pb-32 ${coverImage ? "" : "border-b-2 border-dashed"}`}
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <header className="relative py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

          <button
            className="absolute bottom-0 right-5 flex items-center space-x-1 rounded border border-black border-opacity-50 bg-white px-2 py-0.5 opacity-70 transition-opacity duration-200 hover:opacity-100 xl:-bottom-28"
            onClick={() => setShowCoverSelector(true)}
          >
            <Image size={20} />{" "}
            <span>{coverImage ? "Change" : "Add"} cover</span>
          </button>
        </header>
      </div>

      <main className="-mt-20 h-full">
        <div className="mx-auto h-full max-w-4xl rounded-none pb-12 xl:rounded-sm">
          <div className="prose h-full w-full max-w-none rounded-none border border-black border-opacity-10 xl:rounded-sm">
            <CoverSelector
              open={showCoverSelector}
              setOpen={setShowCoverSelector}
              client={client}
              setCoverImage={setCoverImage}
            />
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <MilkdownProvider>
                <MarkdownEditor content={content} setContent={setContent} />
              </MilkdownProvider>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-5 right-5 flex items-center space-x-4">
        <button
          className="flex items-center space-x-2 rounded bg-black px-2 py-1 text-lg text-white duration-200 hover:opacity-80"
          onClick={() => saveDocument()}
        >
          <FloppyDisk size={20} /> <span>Save</span>
        </button>
      </div>

      <SharingModal open={showSharingModal} setOpen={setShowSharingModal} />
    </div>
  );
}

export default App;
