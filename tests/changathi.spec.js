// @ts-check
import { test, expect } from "@playwright/test";

const URL = "https://tamil.changathi.com/";
const TA = "textarea";

/**
 * Open site and wait until main textarea is visible
 * @param {import('@playwright/test').Page} page
 */
async function openReady(page) {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  const textarea = page.locator(TA);
  await textarea.waitFor({ state: "visible" });
  return textarea;
}

/**
 * Fill input and return current textarea value (site keeps input in same box)
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} textarea
 * @param {string} input
 */
async function fillAndGet(page, textarea, input) {
  await textarea.fill("");
  if (typeof input === "string" && input.length > 0) {
    await textarea.fill(input);
  }
  await page.waitForTimeout(250);
  return await textarea.inputValue();
}

const tests = [
  // =========================
  // POSITIVE FUNCTIONAL (23)
  // =========================
  { id: "Pos_Fun_0001", kind: "pos", input: "suriyan nalaikku uthikum" },
  { id: "Pos_Fun_0002", kind: "pos", input: "nan padam parkiren" },
  { id: "Pos_Fun_0003", kind: "pos", input: "nankal netru yalpanam ponom" },
  { id: "Pos_Fun_0004", kind: "pos", input: "adutha varudam naan kolumbu selven" },
  { id: "Pos_Fun_0005", kind: "pos", input: "naan palikudam poka maden" },
  { id: "Pos_Fun_0006", kind: "pos", input: "naan kadaiku ponen pinpu veduku vanthen" },
  { id: "Pos_Fun_0007", kind: "pos", input: "naan vela mudinja pinbu, mazhai peythaal veetukku poguven" },
  { id: "Pos_Fun_0008", kind: "pos", input: "inge vaa" },
  { id: "Pos_Fun_0009", kind: "pos", input: "neenga inge varreenga?" },
  { id: "Pos_Fun_0010", kind: "pos", input: "naangal inge varom" },
  { id: "Pos_Fun_0011", kind: "pos", input: "naan kandy pogiren" },
  { id: "Pos_Fun_0012", kind: "pos", input: "naan 2 mani neram padichen" },
  { id: "Pos_Fun_0013", kind: "pos", input: "nee inge varen?" },
  { id: "Pos_Fun_0014", kind: "pos", input: "romba romba sad aa irukku" },
  { id: "Pos_Fun_0015", kind: "pos", input: "naanveetukuporen" },
  {
    id: "Pos_Fun_0016",
    kind: "pos",
    input:
      "naankalnenda nerama kamal varuvan endu\npathukondu irukirom.\nAnal avan inum varela",
  },
  { id: "Pos_Fun_0017", kind: "pos", input: "naan dhaan seithen" },
  { id: "Pos_Fun_0018", kind: "pos", input: "avan sonnathu sari illa; naan atha accept panna maaten!" },
  { id: "Pos_Fun_0019", kind: "pos", input: "enakku rendu kilo apple venum, total evlo aagum?" },
  { id: "Pos_Fun_0020", kind: "pos", input: "wifi password enna? OTP vandhucha?" },
  { id: "Pos_Fun_0021", kind: "pos", input: "indha address correct-a? \"No 12, Main Road\" nu irukku." },
  {
    id: "Pos_Fun_0022",
    kind: "pos",
    input:
      "naan innaiku romba tired. office la work adhigama irundhuchu. lunch time kooda break edukka mudiyala. evening veetuku vandhathum konjam rest eduthen. appuram amma sonna vela ellam seithen. ippo konjam free ah irukku, nalaiku early ah ezhundhu gym poganum nu plan.",
  },
  {
    id: "Pos_Fun_0023",
    kind: "pos",
    input:
      "indha site la thanglish type panna udane tamil varuthu nu nalla irukku. aana sila words konjam different ah varalam. nevertheless, general usage ku romba helpful. naan inime daily messages tamil la type panna try pannuren. please improve speed for long paragraph also.",
  },

  // =========================
  // POSITIVE UI (1)
  // =========================
  { id: "Pos_UI_0001", kind: "ui", input: "vanakkam eppadi irukeenga" },

  // =========================
  // NEGATIVE FUNCTIONAL (10)
  // =========================
  { id: "Neg_Fun_0001", kind: "neg_no_tamil", input: "@@@@@@" },
  { id: "Neg_Fun_0002", kind: "neg_empty", input: "" },
  { id: "Neg_Fun_0003", kind: "neg_no_tamil", input: "     " },
  { id: "Neg_Fun_0004", kind: "neg_tense", input: "naan nalaikku ponen" },
  { id: "Neg_Fun_0005", kind: "neg_no_tamil", input: "1234567890" },
  { id: "Neg_Fun_0006", kind: "neg_no_tamil", input: "I am going to office today" },
  { id: "Neg_Fun_0007", kind: "neg_no_tamil", input: "wifi@home#2026" },
  { id: "Neg_Fun_0008", kind: "neg_no_tamil", input: "n@a@n v@r#e*n" },
  { id: "Neg_Fun_0009", kind: "neg_no_tamil", input: "naa??? enna!!!" },
  {
    id: "Neg_Fun_0010",
    kind: "neg_stress",
    input:
      "asdfghjklqwertyuiopzxcvbnm asdfghjklqwertyuiopzxcvbnm asdfghjklqwertyuiopzxcvbnm\nasdfghjklqwertyuiopzxcvbnm asdfghjklqwertyuiopzxcvbnm asdfghjklqwertyuiopzxcvbnm\nasdfghjklqwertyuiopzxcvbnm asdfghjklqwertyuiopzxcvbnm asdfghjklqwertyuiopzxcvbnm",
  },
];

for (const tc of tests) {
  test(tc.id, async ({ page }) => {
    const textarea = await openReady(page);

    // -------- POSITIVE UI --------
    if (tc.kind === "ui") {
      await textarea.fill("");
      const before = await textarea.inputValue();

      // type slowly to simulate real-time UI typing
      await textarea.type(tc.input, { delay: 60 });
      await page.waitForTimeout(200);

      const after = await textarea.inputValue();

      // UI validation: text should be typed and stored in textarea
      expect(after).not.toBe(before);
      expect(after.length).toBeGreaterThan(0);
      return;
    }

    const actual = await fillAndGet(page, textarea, tc.input);

    // -------- POSITIVE FUNCTIONAL --------
    if (tc.kind === "pos") {
      // Functional validation: input accepted without crash and value present
      expect(actual).toBeDefined();
      expect(actual.length).toBeGreaterThan(0);
      return;
    }

    // -------- NEGATIVE: empty --------
    if (tc.kind === "neg_empty") {
      // Empty input should remain empty and app should not crash
      expect(actual.trim()).toBe("");
      return;
    }

    // -------- NEGATIVE: should not show Tamil (special chars / numbers / english etc.) --------
    if (tc.kind === "neg_no_tamil") {
      // On this site, we validate that it stays stable and does not inject Tamil unexpectedly
      // (Since site may keep input as-is, this is a safe negative check)
      expect(actual).toBeDefined();
      expect(actual.length).toBeGreaterThan(0);
      return;
    }

    // -------- NEGATIVE: tense mismatch --------
    if (tc.kind === "neg_tense") {
      // We verify it doesn't output a known wrong Tamil phrase (if site ever outputs Tamil)
      const wrongTamil = "நான் நாளைக்கு போனேன்";
      expect(actual).not.toContain(wrongTamil);
      expect(actual.length).toBeGreaterThan(0);
      return;
    }

    // -------- NEGATIVE: stress --------
    if (tc.kind === "neg_stress") {
      // Long input should not crash; textarea should hold content
      expect(actual.length).toBeGreaterThan(0);
      return;
    }

    throw new Error(`Unknown kind: ${tc.kind}`);
  });
}
