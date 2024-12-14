const fs = require("fs");

export function replaceDomainInArray(
  urls: string[],
  newDomains: string[]
): string[] {
  return urls
    .map((url) => {
      // Split the URL by "http" and rejoin the necessary parts
      const parts = url.split("http");
      if (parts.length > 2) {
        const randomIndex = Math.floor(Math.random() * newDomains.length);
        const newDomain = newDomains[randomIndex];
        const sliceUrl = parts.slice(0, 2).join("http");
        const newUrl = sliceUrl + newDomain;
        return newUrl;
      }
      return null;
    })
    .filter((item) => item !== null) as string[];
}

// Function to append anchor tags to a file
export function setAnchorTagsToFile(
  urls: string[],
  anchorName: string,
  outputFilePath: string
) {
  urls.forEach((url) => {
    const urlTag = `<a href="${url}">${anchorName}</a>`;
    fs.appendFileSync(outputFilePath, urlTag + "\n");
  });
}
