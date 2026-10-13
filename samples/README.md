# Sample images

**These are synthetic images, not real clinical photographs.** They were generated
programmatically to exercise the interface. They are not dermatoscopic data, they came
from no patient, and nothing about them should be read as clinically representative.

They exist so the demo can be driven without the HAM10000 dataset, and so each upload
lands on a predictable category.

| File | Lands on | Confidence | Shows |
|---|---|---|---|
| `01_melanoma.jpg` | Melanoma | 69.6% | **Urgent** triage — the full referral-led care card |
| `02_basal_cell_carcinoma.jpg` | Basal Cell Carcinoma | 70.9% | **Prompt** triage |
| `03_actinic_keratosis.jpg` | Actinic Keratosis | 73.8% | **Prompt** triage, pre-cancerous framing |
| `04_benign_keratosis.jpg` | Benign Keratosis | 71.2% | **Routine** triage |
| `05_melanocytic_nevus.jpg` | Melanocytic Nevus | 67.1% | **Routine** triage |
| `06_dermatofibroma.jpg` | Dermatofibroma | 68.9% | **Routine** triage |
| `07_vascular_lesion.jpg` | Vascular Lesion | 75.0% | **Routine** triage, lesion-specific red flags |

## Why the result is predictable

`src/lib/mockPredict.js` derives its simulated result from a hash of the file's name and
size. Each sample was padded with trailing bytes (which JPEG decoders ignore) until that
hash mapped to the category the image depicts, with a confidence above the 60% usability
threshold. Rename a file and it will land somewhere else — that is expected.

To demonstrate the low-confidence path, use the **"Demo: force a low-confidence result"**
checkbox on the scan page rather than looking for a sample that triggers it.

## Suggested demo order

1. `05_melanocytic_nevus.jpg` — round, even, one colour. Routine: monitor it.
2. `01_melanoma.jpg` — asymmetric, several colours, ragged border. Urgent: the care card
   changes completely. The contrast between these two is the whole argument in ten seconds.
3. Any sample with the low-confidence checkbox ticked — the system declines to answer.
