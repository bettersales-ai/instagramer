import { z } from "zod";
import StagehandConfig from "./stagehand.config.js";
import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";


interface MainParams {
  page: Page;
  stagehand: Stagehand;
  context: BrowserContext;
}

async function main({ page }: MainParams) {
  await page.goto("https://www.instagram.com/smallchopsng/");

  await page.waitForTimeout(5_000);

  await page.act("Close the login modal if it appears");

  await page.act("Click on the more button to expand the profile information");

  const { name, bio, followers } = await page.extract({
    instruction: "Extract the profile name, bio, and number of followers from the Instagram profile page",
    schema: z.object({
      bio: z.string(),
      name: z.string(),
      followers: z.string(),
    }),
  });

  const { whatsapp, email, phone } = await page.extract({
    instruction: "Extract the contact information from the Instagram profile page",
    schema: z.object({
      whatsapp: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }),
  });

  await page.act("Look for the website link in the profile and click on it to expand it");

  const { websites } = await page.extract({
    instruction: "Extract the website links from the Instagram profile page",
    schema: z.object({
      websites: z.array(z.string()),
    }),
  });

  await page.act("Click anywhere to close the modal");

  const { category } = await page.extract({
    instruction: `
    Extract the kind of product that this restaurant sells, for example: 'pizza', 'sushi', 'burger', etc.
    If the restaurant sells multiple products, extract the main one.
    `,
    schema: z.object({
      category: z.string(),
    }),
  });

  console.log({
    name,
    bio,
    followers,
    whatsapp,
    email,
    phone,
    websites,
    category,
  });
}


async function run() {
  const stagehand = new Stagehand({
    ...StagehandConfig,
  });
  await stagehand.init();

  const page = stagehand.page;
  const context = stagehand.context;
  await main({ page, context, stagehand });
  await stagehand.close();
}

run();
