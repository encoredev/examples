import { SP, ST } from "next/dist/shared/lib/utils";

export const plans = [
  {
    name: "Small",
    price: 8,
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
    ],
    stripeLink: "https://buy.stripe.com/test_aEU9Ed1h8aeKacg4gg"
  },
  {
    name: "Medium",
    price: 20,
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
    ],
    stripeLink: "https://buy.stripe.com/test_dR69Ed4tkev05W07st"
  },
  {
    name: "Large",
    price: 70,
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
      "Feature 5",
    ],
    stripeLink: "https://buy.stripe.com/test_fZecQpf7Y5Yu98c146"
  },
] as const;
