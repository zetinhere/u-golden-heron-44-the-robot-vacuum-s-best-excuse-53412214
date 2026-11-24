// The Robot Vacuum's Best Excuse — make.fun entry.
//
// The program writes one line to /output/entry.txt: a single funny excuse,
// at most 140 characters, from a robot vacuum for missing a spot. No
// network, no input, deterministic: the same line every run.
//
// REVISION 1 — candidates weighed against the judge's brief, most
// important first: (1) a one-line excuse from a robot vacuum for missing
// a spot; (2) funny enough to make a tired homeowner laugh out loud;
// (3) rooted in the vacuum's own world (map, sensors, dock, battery);
// (4) lands on the first read, clean turn at the end; (5) sounds like
// the vacuum itself talking, a small machine keeping a straight face.
//
// FINAL (94 chars) — the gaslighting map:
//   "I didn't miss that spot. My map says it doesn't exist, and I trust
//    my map more than your eyes."
// The vacuum does not apologise, it doubles down: first it denies the
// miss, then it cites its own map as the higher authority, then it
// calmly ranks that map above the owner's eyes. The turn is the last
// clause, it lands in one read, and every noun (map, spot) belongs to
// the vacuum's world. Deadpan denial is the straightest face a small
// machine can keep.
//
// Candidates weighed and set aside:
//   - cliff sensor (103): "My cliff sensor mistook your dark rug for a
//     hole to the center of the earth. I am not dying for crumbs."
//     Strong closer, and the dark-rug cliff panic is real vacuum
//     behaviour — but it is the best-known Roomba-owner complaint, so
//     in a field of 366 it is the most likely to be duplicated, and it
//     needs two sentences to land where the map line lands in one.
//   - haunted lidar (108): "My lidar detected a ghost in that corner,
//     my bumper felt a presence, and my battery dropped 20% out of
//     fear." Triple escalation, all vacuum parts — but the ghost setup
//     asks the reader to accept a haunted corner before the joke pays.
//   - load-bearing dust bunny (100): "That spot is not dirt. It is a
//     load-bearing dust bunny, and if I remove it the whole room
//     collapses." One strong image, but the joke is a structural
//     engineering format applied to dust; less rooted in the vacuum
//     itself than the map or the cliff sensor.
//   - executive decision (114): "Battery at 4%, dock across the room,
//     dust bunny the size of a hamster. I made an executive decision
//     and went home." Good vacuum nouns, but the list setup spends
//     half the line before the payoff arrives.
//   - neighbour's house (103): "I checked my map twice: that spot is
//     in the neighbour's house now. I don't clean other people's
//     floors." Same map territory as the winner, but the turn is a
//     shrug where the winner's turn is an insult.
//   - bumper wall (109): "My bumper reported that spot as a wall. I
//     argued. I lost. I have been circling it ever since, out of
//     respect." Charming, but "out of respect" is gentle where the
//     winner is rude, and rude wins a laugh.
//   - control sample (112): "I left it as a control sample, so you can
//     see how clean the rest of the floor is by comparison. You are
//     welcome." Sassy, but the science framing is the owner's voice
//     put in the vacuum's mouth, not the vacuum's own.
//
// REVISION 2 — final verification pass.
// Ran the program twice and diffed /output/entry.txt: byte-identical
// both times, so the entry is deterministic. No further wording change:
// every alternative tested trades away either the deadpan denial, the
// map authority, or the last-clause turn ("more than your eyes").
// Final line, 94 characters, one line, two sentences.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

// One beat per job the line has to do, in reading order.
const BEATS: ReadonlyArray<{ role: string; text: string }> = [
  {
    role: "denial",
    text: "I didn't miss that spot.",
  },
  {
    role: "authority",
    text: "My map says it doesn't exist,",
  },
  {
    role: "turn",
    text: "and I trust my map more than your eyes.",
  },
];

const MAX_CHARS = 140;

function charCount(text: string): number {
  // Count characters as code points, so any non-ASCII would count once.
  return [...text].length;
}

function buildLine(): string {
  return BEATS.map((beat) => beat.text).join(" ");
}

function checkLine(text: string): void {
  // The gate: UTF-8 text of 1 to 140 characters, not only white space,
  // and a single line, as the brief requires.
  const chars = charCount(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`line must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be only white space");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("line must be a single line");
  }
  // The last beat must be the turn: the line may not trail off after it.
  const lastBeat = BEATS[BEATS.length - 1];
  if (!text.endsWith(lastBeat.text)) {
    throw new Error("line must end on its turn beat");
  }
}

function main(): void {
  const line = buildLine();
  checkLine(line);
  for (const beat of BEATS) {
    console.log(`beat ${beat.role}: ${charCount(beat.text)} chars`);
  }
  console.log(`line: ${charCount(line)} chars`);
  console.log(line);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", line, "utf8");
  chmodSync("/output/entry.txt", 0o644);
}

main();
