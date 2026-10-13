// Care guidance keyed to the seven HAM10000 lesion classes.
//
// Content rules (deliberate, do not relax):
//  - No drug names, no dosages, no prescriptive treatment.
//  - For urgent/prompt tiers the referral leads; self-care is framed only as
//    what to do *while waiting* for an appointment, never as an alternative.
//  - Guidance follows a prediction that can be wrong, so every card is
//    presented as conditional, not as a verdict.

export const DISCLAIMER =
  "MEdAI is a screening aid, not a diagnosis. Only a qualified clinician can diagnose a skin condition.";

export const TRIAGE = {
  urgent: {
    label: "See a dermatologist urgently",
    note: "Potentially serious. Do not wait for it to change.",
  },
  prompt: {
    label: "Book a dermatologist appointment",
    note: "Needs professional assessment, but it is not an emergency.",
  },
  routine: {
    label: "Monitor and mention at your next visit",
    note: "Commonly benign. Keep an eye on it for change.",
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
    triage: "urgent",
    malignant: true,
    whatItIs:
      "Melanoma is a cancer of the pigment-producing cells in the skin. It is the most serious form of skin cancer, and outcomes are strongly better the earlier it is treated.",
    seekCare:
      "Arrange a dermatologist or skin-cancer clinic appointment as soon as you can — within days, not months. If your health system has an urgent skin-lesion pathway, this is what it is for.",
    selfCare: [
      "Do not scratch, pick, shave over or attempt to remove the lesion",
      "Photograph it next to a ruler or coin so the clinician can see its size",
      "Keep it covered from the sun and avoid sunbeds entirely",
      "Write down when you first noticed it and what has changed since",
    ],
    redFlags: UNIVERSAL_RED_FLAGS,
  },
  bcc: {
    code: "bcc",
    name: "Basal Cell Carcinoma",
    triage: "prompt",
    malignant: true,
    whatItIs:
      "Basal cell carcinoma is the most common form of skin cancer. It grows slowly and very rarely spreads elsewhere in the body, but it does need medical treatment to be removed.",
    seekCare:
      "Book a dermatologist appointment in the next few weeks. Treatment is usually straightforward, and earlier treatment means a smaller procedure.",
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
    triage: "prompt",
    malignant: true,
    whatItIs:
      "These are rough, sun-damaged patches of skin. They are considered pre-cancerous: a proportion can progress to squamous cell carcinoma if left untreated.",
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
    triage: "routine",
    malignant: false,
    whatItIs:
      "Benign keratoses — including seborrhoeic keratoses and solar lentigines — are harmless growths that become more common with age and sun exposure. They do not turn into cancer.",
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
    triage: "routine",
    malignant: false,
    whatItIs:
      "A melanocytic nevus is an ordinary mole — a benign cluster of pigment cells. Most adults have between ten and forty of them, and the large majority never cause any problem.",
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
    triage: "routine",
    malignant: false,
    whatItIs:
      "A dermatofibroma is a firm, benign nodule of fibrous tissue in the skin, often appearing after a minor injury such as an insect bite. It is harmless and usually persists unchanged for years.",
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
    triage: "routine",
    malignant: false,
    whatItIs:
      "Vascular lesions — such as angiomas, cherry angiomas and pyogenic granulomas — are benign collections of small blood vessels. They are very common and not a form of cancer.",
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
