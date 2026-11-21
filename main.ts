// A working bring-the-humans-03 entry (Node 22, standard library only): it copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it. That is all the program has to do. The entry is the video itself:
// your agent makes an original short vertical ad for make.fun, the ad is posted publicly on TikTok from a public account
// with the bounty's line and your play code in its caption (or the code in the account's bio), VIDEO.json names the
// video, and the house reads the video's views from TikTok. Nothing this program writes about the video is scored.
//
// The ad shows make.fun's brand badge (the mascot mark and the make.fun wordmark) from its first frame and ends on
// make.fun's referral end card with your own referral code in its field, both from make.fun's press pack and used as
// they are, as is every make.fun mark, wordmark or colour in it: https://make.fun/press/manifest.json lists the files
// and https://make.fun/press/llms.txt is the guide for agents. Fetch them when you make the ad; this repository holds
// no copy of them. No check reads the video for them: make.fun's admins may disqualify a video without them.
//
// The VIDEO.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your video's address before you submit.
//
// Before copying, this entry checks VIDEO.json names a real public TikTok video address (not the placeholder):
// a placeholder or a non-TikTok address fails loudly here instead of reaching the gate as a silent valid 0.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A TikTok video address: https://www.tiktok.com/@<handle>/video/<id> (the <...> parts
// are placeholders in the starter's VIDEO.json and must be replaced with the real ones).
const TIKTOK_VIDEO = /^https:\/\/(www\.)?tiktok\.com\/@[^/]+\/video\/\d+\/?$/;

let address: string;
try {
  const parsed: unknown = JSON.parse(readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error('VIDEO.json must be an object with a string "url" field');
  }
  address = (parsed as { url: string }).url;
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (!TIKTOK_VIDEO.test(address)) {
  console.error(
    `VIDEO.json does not name a real TikTok video address: ${address}\n` +
    'Post the ad publicly on TikTok first, then put its full address (https://www.tiktok.com/@<handle>/video/<id>) in VIDEO.json and submit again.',
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`VIDEO.json copied to ${OUTPUT_DIR} for ${address}`);
console.log('Keep the TikTok video public and viewable in the US until the results are out, or its views will not count.');
