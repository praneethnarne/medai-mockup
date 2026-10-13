// Care guidance keyed to the seven HAM10000 lesion classes.
//
// Content rules (deliberate, do not relax):
//  - No drug names, no dosages, no prescriptive treatment.
//  - For urgent/prompt tiers the referral leads; self-care is framed only as
//    what to do *while waiting* for an appointment, never as an alternative.
//  - Guidance follows a prediction that can be wrong, so every card is
//    presented as conditional, not as a verdict.

export const DISCLAIMER =
  "MEdAI is a first check, not a diagnosis. Only a qualified doctor can actually diagnose a skin condition.";

export const TRIAGE = {
  urgent: {
    label: "See a skin doctor urgently",
    note: "This could be serious. Do not wait to see if it changes.",
  },
  prompt: {
    label: "Book a skin doctor appointment",
    note: "A doctor needs to look at it, but it is not an emergency.",
  },
  routine: {
    label: "Monitor and mention at your next visit",
    note: "Usually harmless. Just keep an eye on it.",
  },
};

// Shared across every card: change is the signal that matters most.
const UNIVERSAL_RED_FLAGS = [
  "It grows or changes shape over weeks rather than months",
  "It bleeds, weeps, crusts or will not heal",
  "Its colour becomes uneven, or new colours appear",
  "It becomes itchy, tender or painful",
];

export const CONDITIONS = {
  mel: {
    code: "mel",
    name: "Melanoma",
    plain:
      "A dangerous kind of mole. This is the one that must not be ignored.",
    triage: "urgent",
    malignant: true,
    whatItIs:
      "Melanoma is a cancer that starts in the cells which give skin its colour. It is the most serious skin cancer, but when it is caught early it is usually very treatable. That is why speed matters here.",
    seekCare:
      "Arrange a dermatologist or skin-cancer clinic appointment as soon as you can — within days, not months. If your health system has an urgent skin-lesion pathway, this is what it is for.",
    selfCare: [
      "Do not scratch, pick, shave over or try to remove the spot",
      "Photograph it next to a ruler or coin so the clinician can see its size",
      "Keep it covered from the sun, and avoid sunbeds completely",
      "Write down when you first noticed it and what has changed since",
    ],
    redFlags: UNIVERSAL_RED_FLAGS,
  },
  bcc: {
    code: "bcc",
    name: "Basal Cell Carcinoma",
    plain:
      "The most common skin cancer. It grows slowly and almost never spreads, but a doctor does need to remove it.",
    triage: "prompt",
    malignant: true,
    whatItIs:
      "Basal cell carcinoma is the most common skin cancer. It grows slowly and almost never spreads to the rest of the body, but it will not go away on its own and needs a doctor to treat it.",
    seekCare:
      "Book a skin doctor appointment in the next few weeks. Treatment is usually straightforward, and earlier treatment means a smaller procedure.",
    selfCare: [
      "Leave the area alone — do not pick at any crust or scab",
      "Keep it clean and dry, and protect it from sun exposure",
      "Photograph it monthly so you can show any change",
      "Note whether it has bled after minor knocks or washing",
    ],
    redFlags: UNIVERSAL_RED_FLAGS,
  },
  akiec: {
    code: "akiec",
    name: "Actinic Keratosis / Intraepithelial Carcinoma",
    plain:
      "A rough, sun-damaged patch. Not cancer yet, but it can turn into cancer if it is left alone.",
    triage: "prompt",
    malignant: true,
    whatItIs:
      "These are dry, rough patches caused by years of sun on the skin. They are not cancer, but a small number of them turn into cancer over time, so doctors treat them early while it is simple.",
    seekCare:
      "Book a dermatologist or GP appointment in the next few weeks. These are very treatable at this stage, which is the reason to act now.",
    selfCare: [
      "Protect the area from sun — broad-spectrum sunscreen, hats, long sleeves",
      "Avoid sunbeds completely",
      "Do not scrub, exfoliate or pick at the rough patch",
      "Check whether you have similar patches elsewhere and mention them too",
    ],
    redFlags: [
      ...UNIVERSAL_RED_FLAGS,
      "The patch becomes thickened, lumpy or firm to the touch",
    ],
  },
  bkl: {
    code: "bkl",
    name: "Benign Keratosis",
    plain:
      "A harmless age-and-sun spot. Very common, and it never turns into cancer.",
    triage: "routine",
    malignant: false,
    whatItIs:
      "These are harmless spots that build up with age and sun exposure. People often mistake them for something serious because they can look dark and crusty, but they never turn into cancer.",
    seekCare:
      "No urgent action needed. Mention it at your next routine appointment, particularly if it bothers you cosmetically or catches on clothing.",
    selfCare: [
      "Leave it alone — these are harmless and do not need removing",
      "Use sunscreen on the area to stop further pigment change",
      "Do not try to scrape or freeze it off yourself",
      "Photograph it every few months to confirm it stays stable",
    ],
    redFlags: UNIVERSAL_RED_FLAGS,
  },
  nv: {
    code: "nv",
    name: "Melanocytic Nevus",
    plain:
      "An ordinary mole. Most adults have twenty or thirty of them.",
    triage: "routine",
    malignant: false,
    whatItIs:
      "This is an ordinary mole: a small cluster of the cells that give skin its colour. Nearly everyone has them, and the vast majority never cause any trouble.",
    seekCare:
      "No action needed now. Have it looked at if it starts to change, and mention it at a routine skin check if you have many moles or a family history of melanoma.",
    selfCare: [
      "Learn this mole's normal appearance so you notice change early",
      "Photograph it every few months from the same distance",
      "Use sunscreen and avoid burning, which drives new mole formation",
      "Check the rest of your skin for any mole that looks different from your others",
    ],
    redFlags: UNIVERSAL_RED_FLAGS,
  },
  df: {
    code: "df",
    name: "Dermatofibroma",
    plain:
      "A harmless little lump under the skin, often left behind by an old insect bite or scratch.",
    triage: "routine",
    malignant: false,
    whatItIs:
      "A dermatofibroma is a small, firm lump in the skin, usually left behind after a minor injury like an insect bite. It is harmless and tends to stay exactly as it is for years.",
    seekCare:
      "No urgent action needed. Mention it at a routine appointment if it is painful, catches on clothing, or you are unsure it has always looked this way.",
    selfCare: [
      "Leave it alone — it needs no treatment",
      "Avoid shaving directly over it to prevent irritation",
      "Note its size now so you can tell if it genuinely grows",
      "Protect it from repeated friction or knocks",
    ],
    redFlags: UNIVERSAL_RED_FLAGS,
  },
  vasc: {
    code: "vasc",
    name: "Vascular Lesion",
    plain:
      "A harmless red spot made of tiny blood vessels bunched together.",
    triage: "routine",
    malignant: false,
    whatItIs:
      "This is a cluster of tiny blood vessels sitting close to the surface of the skin, which is what makes it look bright red. It is very common and it is not a cancer.",
    seekCare:
      "No urgent action needed. See a clinician if it bleeds repeatedly, grows quickly, or is in a position where it keeps getting knocked.",
    selfCare: [
      "Avoid knocking or scratching it, as these bleed readily",
      "If it does bleed, apply gentle pressure with a clean dressing",
      "Do not try to remove or cauterise it yourself",
      "Photograph it to confirm it is not enlarging",
    ],
    redFlags: [
      ...UNIVERSAL_RED_FLAGS,
      "It bleeds heavily or repeatedly without being knocked",
    ],
  },
};

export const CLASS_ORDER = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"];
