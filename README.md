# MEdAI — interface mockup

**Connect it to the MEdAI model server and every result comes from the trained model.
With no server connected it falls back to simulated results, and every screen says so
("DEMO DATA" versus "LIVE MODEL").** It exists to show what the MEdAI
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

## Connecting the real model

1. Start the model server from the `praneethnarne/medai` repo, either on this computer:

   ```bash
   python backend/src/demo/app.py --run pad_ft_effb0_phoneaug
   ```

   or in the Colab notebook (add `--share`), which prints a `https://….gradio.live` link.
2. Run this interface (below), open **New scan**, paste the server address
   (`http://127.0.0.1:7860` or the gradio.live link) into **Model server**, and press
   **Connect**. The badge turns to **CONNECTED — real model**.

The address can also be given as `?api=<address>` on any page. It is remembered in
this browser only. The interface calls the server's `/predict_json` endpoint; see
`src/lib/predict.js`.

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

`src/lib/predict.js` decides: with a server configured it calls the trained model;
without one it uses `src/lib/mockPredict.js`, the only file that fabricates anything.

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
