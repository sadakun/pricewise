"use server";

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string) {
  // check if no product url then exit
  if (!productUrl) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;
  } catch (error: any) {
    throw new Error("Failed to create/update product: ${error.message}");
  }
}
