import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_0cca69f1-zone-pricewise:xb1kh3ptch3t -k "https://geo.brdtest.com/welcome.txt"

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: "${username}-session-${session_id}",
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the procut page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      // $(".a-price.a-text-price"),
      $(".a-price.a-text-price.a-size-medium.apexPriceToPay")
    );

    const originalPrice = extractPrice(
      // $("#priceblock_ourprice"),
      // $(".a-price.a-text-price span.a-offscreen"),
      // $("#priceblock_dealprice"),
      $(".a-price.a-text-price.a-size-base")
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    console.log({ title, currentPrice, originalPrice });
  } catch (error: any) {
    throw new Error("Failed to scrape product: ${error.message}");
  }
}
