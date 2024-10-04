import { FC, useMemo } from "react";

interface Suggestion {
  voice: string;
  text: string;
}

const data: Suggestion[] = [
  {
    voice: "Paul",
    text: "The sunset painted the sky in hues of orange and pink, casting a warm glow over the tranquil sea.",
  },
  {
    voice: "George",
    text: "Imagine a world where every child has access to quality education. Together, we can make this dream a reality by supporting educational initiatives.",
  },
  {
    voice: "Nicole",
    text: "Once upon a time, in a land far, far away, there lived a brave knight who embarked on an epic journey to rescue the captured princess.",
  },
  {
    voice: "Drew",
    text: "Take a deep breath in, hold it for a moment, and then slowly exhale. Let all your stress melt away.",
  },
  {
    voice: "Mimi",
    text: "Wow, did you hear about the latest tech gadget? It's revolutionizing the way we interact with our devices!",
  },
  {
    voice: "Bill",
    text: "To bake the perfect chocolate cake, start by preheating your oven to 350 degrees Fahrenheit and gathering all your ingredients.",
  },
  {
    voice: "Glinda",
    text: "Good evening, ladies and gentlemen. We are gathered here today to celebrate the remarkable achievements of our distinguished guests.",
  },
  {
    voice: "Serena",
    text: "Hey, have you ever tried that new café downtown? Their coffee is amazing, and they have the best pastries.",
  },
  {
    voice: "Lily",
    text: "In a quiet village nestled between rolling hills, a young girl named Emma discovered a hidden path that led to an enchanted forest.",
  },
];

const Suggestions: FC<{ onSelect: (s: Suggestion) => void }> = ({
  onSelect,
}) => {
  const randomSuggestions = useMemo(() => {
    return data.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, []);
  return (
    <div className="grid grid-cols-2 gap-4 group">
      {randomSuggestions.map((suggestion) => (
        <SuggestionBox
          key={suggestion.voice}
          onClick={() => {
            onSelect(suggestion);
          }}
          voice={suggestion.voice}
          text={suggestion.text}
        />
      ))}
    </div>
  );
};

export default Suggestions;

const SuggestionBox: FC<Suggestion & { onClick: () => void }> = ({
  text,
  voice,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col text-left p-4 py-2 cursor-pointer bg-white border rounded-sm border-black border-opacity-20 opacity-70 transition hover:opacity-100 hover:bg-black hover:bg-opacity-5"
    >
      <p className="font-semibold text-sm">{voice}</p>
      <p className="text-xs">{text}</p>
    </div>
  );
};
