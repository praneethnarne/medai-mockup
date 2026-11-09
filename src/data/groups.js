// Level 1 groups ("what kind of thing is this"), shown only when the model server
// runs the group model. Mirrors backend/src/demo/care.py in praneethnarne/medai:
// no drug names or dosages; emergencies lead. Needs review by the project guide.

export const EMERGENCY = [
  "Swelling of the face, lips, tongue or throat, or trouble breathing or swallowing",
  "Feeling faint, dizzy or confused, or a racing heartbeat",
  "A rash that does not fade when a clear glass is pressed against it",
  "A large burn, or any burn on the face, hands, feet or genitals",
  "Bleeding that does not stop after 10 minutes of firm pressure",
];

export const GROUPS = {
  spot_growth: { name: "Skin spot or growth" },
  rash: {
    name: "Rash or skin inflammation",
    headline: "Usually not urgent — keep an eye on it",
    triage: "routine",
    plain: "A rash or patch of inflamed skin. Most are harmless and settle, but some need a doctor.",
    seekCare:
      "See a doctor or pharmacist if it lasts more than a week or two, keeps coming back, is spreading, or is stopping you from sleeping.",
    selfCare: [
      "Avoid anything new that touched the skin before it started (soap, cream, plant, fabric)",
      "Keep the area cool and avoid scratching",
      "Use plain, unperfumed products on the area",
      "Photograph it each day so you can show how it changes",
    ],
    redFlags: [
      "It spreads quickly, blisters, or the skin starts to peel",
      "You have a fever or feel unwell with it",
      "It is around the eyes, mouth or genitals",
    ],
  },
  infection: {
    name: "Skin infection",
    headline: "See a doctor or pharmacist in the next few days",
    triage: "prompt",
    plain: "It may be a skin infection (fungal, bacterial or viral). These usually need treatment.",
    seekCare:
      "See a doctor or pharmacist in the next few days. Go sooner if it is spreading, painful, near the eye, or you have a fever.",
    selfCare: [
      "Keep it clean and dry, and avoid touching or scratching it",
      "Wash your hands after touching it, and don't share towels",
      "Cover it loosely if it is weeping",
      "Note when it started and whether it is getting bigger",
    ],
    redFlags: [
      "Redness spreading outward, or red streaks running from it",
      "Fever, chills, or feeling generally unwell",
      "Increasing pain, warmth or swelling, or pus",
      "Painful blisters in a band on one side of the body or face",
    ],
  },
  bite_sting: {
    name: "Insect bite or sting",
    headline: "Usually settles on its own — watch for the warning signs",
    triage: "routine",
    plain: "It looks like an insect bite or sting. Most settle on their own within days.",
    seekCare:
      "See a doctor or pharmacist if it is still getting bigger after two days, looks infected, or a ring-shaped rash appears after a tick bite.",
    selfCare: [
      "Wash it with soap and water",
      "Hold something cold on it (wrapped, not directly on the skin) to ease swelling",
      "Raise the area if you can, and try not to scratch",
      "Remove a sting or tick carefully if one is still in the skin",
    ],
    redFlags: [
      "Redness, warmth or swelling still spreading after 48 hours",
      "Fever, or feeling unwell after a bite",
      "A bullseye-shaped rash after a tick bite",
      "Many bites or stings at once",
    ],
  },
  wound_scar: {
    name: "Wound, burn, bruise or scar",
    headline: "Usually heals on its own — keep it clean and watch it",
    triage: "routine",
    plain: "It looks like a wound, burn, bruise or scar — an injury or what it left behind.",
    seekCare:
      "See a doctor for deep or gaping cuts, animal or human bites, dirty wounds (ask about tetanus protection), burns that blister or are larger than your palm, or a scar that keeps growing, hurts or changes.",
    selfCare: [
      "Rinse a fresh wound with clean running water",
      "Press firmly with a clean cloth to stop bleeding, then cover it",
      "Cool a burn under cool running water for 20 minutes; do not use ice",
      "Keep it clean and check it daily for signs of infection",
    ],
    redFlags: [
      "Increasing redness, warmth, swelling, pus or pain after the first day or two",
      "A scar or mark that grows, bleeds or changes colour",
      "Numbness or trouble moving a nearby finger or joint",
    ],
  },
};
