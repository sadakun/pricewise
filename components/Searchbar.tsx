"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

// this const return a boolean
const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);

    // first step to get for example amazon.com/
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");

  // loading for try catch
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // refresh after click search
    event.preventDefault();

    // checking the url is real or intended url
    const isValidLink = isValidAmazonProductURL(searchPrompt);

    // checking isValidLink from searchbar
    // alert(isValidLink ? "Valid link" : "Invalid link");
    // result valid link for https://amazon.com and invalid for amazon.com

    if (!isValidLink) return alert("Please provide a valid Amazon link");

    try {
      setIsLoading(true);

      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searchong..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
