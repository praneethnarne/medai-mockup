# MEdAI — interface mockup

**This is a UI mockup with simulated inference. No trained model is connected, and
every prediction shown is generated, not measured.** It exists to show what the MEdAI
system will look like and how it will behave. The real system is built separately.

MEdAI is a final-year project at MLR Institute of Technology: explainable AI for
dermatological screening. It classifies a dermatoscopic image into one of the seven
HAM10000 lesion categories, shows which regions drove the prediction, and turns the
result into practical next steps.

## What this demonstrates

| | |
|---|---|
| **Explainable prediction** | Grad-CAM panel with an opacity slider, so you can see whether the model looked at the lesion or at something irrelevant. The overlay here is an illustrative placeholder — the real heatmap needs the trained model. |
| **Honest uncertainty** | Below 60% confidence the result leads with "not reliable enough to act on" rather than presenting a label. Toggle it on the scan page to see this path. |
| **Care guidance** | The feature that distinguishes MEdAI from the systems it builds on: a triage tier, steps for the wait, and the specific changes that mean you should be seen sooner. |

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Flow

`/` landing → `/signin` → `/dashboard` history → `/detect` upload → `/result/:id`

Sign-in and sign-up are non-functional placeholders: no credentials are validated or
stored, and the forms simply continue.

## Where the seam is

`src/lib/mockPredict.js` is the only file that fabricates anything. It returns the exact
shape the real `POST /predict` will return, so swapping to a live backend is a change to
that one module.

Care guidance content lives in `src/data/conditions.js`, one entry per class, written
under deliberate constraints: no drug names, no dosages, no prescriptive treatment, and
for malignant or pre-cancerous categories the referral leads while self-care is framed
only as what to do while waiting for an appointment.

## Not in this mockup

Model training, real inference, real Grad-CAM, authentication, persistence, the
architecture comparison. Those belong to the main project repository.

---

MEdAI is a screening aid, not a diagnosis. Only a qualified clinician can diagnose a
skin condition.
