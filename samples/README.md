# Sample images

Two sets, for two different jobs.

## `real/` — genuine clinical images (use these for the demo)

14 real dermatoscopic images, 2 per category, from the public
[ISIC Archive](https://www.isic-archive.com/) — the same archive the HAM10000 dataset
comes from. All are **CC-0** (public domain), de-identified, and published for research.
The ISIC ID is in each filename, so any image can be traced back to its record.

These are what the real system will actually consume: photographs taken through a
dermatoscope, a magnifier with a light held against the skin.

| File | Lands on | Confidence |
|---|---|---|
| `01a/01b_melanoma_*` | Melanoma | 72.7% / 74.7% |
| `02a/02b_basal_cell_carcinoma_*` | Basal Cell Carcinoma | 75.3% / 73.9% |
| `03a/03b_actinic_keratosis_*` | Actinic Keratosis | 78.6% / 74.1% |
| `04a/04b_benign_keratosis_*` | Benign Keratosis | 75.5% / 70.7% |
| `05a/05b_melanocytic_nevus_*` | Melanocytic Nevus | 66.3% / 72.9% |
| `06a/06b_dermatofibroma_*` | Dermatofibroma | 73.0% / 66.4% |
| `07a/07b_vascular_lesion_*` | Vascular Lesion | 73.0% / 74.8% |

Source: ISIC Archive, CC-0. Retrieved 2026-10-13.

## `illustrative/` — synthetic renders

7 generated images showing a spot on a forearm or calf. **These are not photographs.**
They were drawn programmatically to make the difference between a harmless mole and a
dangerous one obvious to someone seeing the problem for the first time — real clinical
images are far subtler, which is exactly the point the landing page makes.

Use them to explain the problem. Use `real/` to demonstrate the system.

## Why the result is predictable

`src/lib/mockPredict.js` derives its simulated result from a hash of the file's name and
size. Every sample in both sets was padded with trailing bytes (which JPEG decoders
ignore) until that hash mapped to the category the image actually belongs to, at a
confidence above the 60% usability threshold. The image data itself is untouched.

Rename a file and it will land somewhere else — that is expected. To show the
low-confidence path, use the **"Demo: force a low-confidence result"** checkbox on the
scan page.

## Suggested demo order

1. `illustrative/05_melanocytic_nevus.jpg` then `illustrative/01_melanoma.jpg` — the
   obvious version of the difference.
2. `real/05a_melanocytic_nevus_*` then `real/01a_melanoma_*` — the same comparison in
   real clinical data, where it is genuinely hard. This is the moment the project
   justifies itself.
3. Any image with the low-confidence checkbox ticked — the system declines to answer.
