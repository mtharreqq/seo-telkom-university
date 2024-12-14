import { green, reset, yellow } from "../lib/color-terminal";

// Remove Duplicate URLs from a List
export function removeDuplicates(urls: string[]) {
  const uniqueUrls = [...new Set(urls)];
  if (uniqueUrls.length === urls.length) {
    console.log(`${yellow}No duplicates found in the URLs list${reset}`);
  } else {
    console.log(
      yellow + `Got ${uniqueUrls.length} from ${urls.length} total URLs` + reset
    );
  }
  return uniqueUrls;
}

// // Filter Out Duplicate URLs and Keep Only Unique Entries
// export function removeDuplicates(urls: string[]) {
//   const urlCounts = urls.reduce((acc, url) => {
//     acc[url] = (acc[url] || 0) + 1; // Count occurrences of each URL
//     return acc;
//   }, {});

//   const filteredUrls = urls.filter((url) => urlCounts[url] === 1); // Keep only unique URLs

//   console.log(
//     `Removed duplicates. Original: ${urls.length}, Unique: ${filteredUrls.length}`
//   );

//   return filteredUrls;
// }

export function getUniqueDomains(urls: string[], maxUrls: number) {
  // Helper function to extract domain from a URL
  function getDomain(url: string): string | null {
    try {
      return new URL(url).hostname;
    } catch (e) {
      console.error(`Invalid URL: ${url}`);
      return null;
    }
  }

  // Group URLs by their domain and filter groups based on maxUrls
  function groupAndFilterUrls(urls: string[], maxUrls: number): string[][] {
    const domainMap: Record<string, string[]> = {};

    urls.forEach((url) => {
      const domain = getDomain(url);
      if (domain) {
        if (!domainMap[domain]) {
          domainMap[domain] = [];
        }
        if (domainMap[domain].length < maxUrls) {
          domainMap[domain].push(url);
        }
      }
    });

    return Object.values(domainMap).filter((group) => group.length <= maxUrls);
  }

  const result = groupAndFilterUrls(urls, maxUrls).flat();
  console.log(
    yellow +
      `Got ${result.length} URLs with unique Domains from ${urls.length} total URLs\n` +
      reset
  );
  return result;
}
