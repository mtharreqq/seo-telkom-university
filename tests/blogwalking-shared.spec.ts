import { test, chromium } from "@playwright/test";
import { blue, green, red, reset, yellow } from "../lib/color-terminal";
import {
  clearFileContent,
  getUrlsFromFile,
  isFileExist,
  isFolderExist,
} from "../lib/file-handler";
import { removeDuplicates, getUniqueDomains } from "../lib/blogwalking-filter";
import { getCurrentTime } from "../lib/get-current-time";
const fs = require("fs");

const emails = ["dummy@gmail.com"];
const website = "https://telkomuniversity.ac.id/en/";
const author = "Telkom University";
const comments = ["Just a Placeholder Comments"];

test("Blogwalking - Form Exist", async () => {
  // Check if folder  exist
  const inputPathName = "input";
  const outputPathName = "results";
  const inputFolderPath = isFolderExist(inputPathName);
  const outputFolderPath = isFolderExist(outputPathName);

  // Check if file exist
  const inputFileName = "blogwalking-link.txt";
  const formExistsFileName = "result-form-exist-link.txt";
  const commentFileName = "result-comment-exist-link.txt";
  const inputFilePath = isFileExist(inputFolderPath, inputFileName);
  const formExistsFilePath = isFileExist(outputFolderPath, formExistsFileName);
  const commentFilePath = isFileExist(outputFolderPath, commentFileName);

  // Delete all content from output file
  clearFileContent(formExistsFilePath);
  clearFileContent(commentFilePath);

  // Wait guys, this code is important
  await new Promise((resolve) => setTimeout(resolve, 500));

  //Make this code run endlessly
  test.setTimeout(0);

  // Playwright launch browser
  const browser = chromium.launch();
  let context = await (await browser).newContext();
  let page = await context.newPage();

  // Get url from "redirect-link.txt" & anchorFilePath and set to array
  let urls = getUrlsFromFile(inputFilePath);

  // Remove if url have duplicate
  const uniqueUrls = removeDuplicates(urls);

  // Get just 5 Domain same
  const uniqueDomains = getUniqueDomains(uniqueUrls, 5);

  // Go to every url in file "urls.txt"
  for (const [index, url] of uniqueDomains.entries()) {
    try {
      console.log(
        `${yellow}${getCurrentTime()} | [${index + 1}/${
          uniqueDomains.length
        }]${reset} ${url}`
      );

      const response = await page.goto(url as string, {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });

      // Check if this page can response or not (?)
      if (!response?.ok()) {
        console.log(`${red}(Website is not response)${reset}\n`);
        continue;
      }

      // Check if tag form with methode POST exist
      const formExists = await page
        .$eval('form[method="post"]', (form) => !!form)
        .catch(() => false);
      console.log(
        formExists
          ? `${green}Form exists${reset}`
          : `${red}Form does not exist${reset}\n`
      );

      // Check if inside tag form exist for every input and fill it
      if (formExists) {
        fs.appendFileSync(formExistsFilePath, url + "\n");
        // WEBSITE
        const hasWebsiteInput = await page
          .$eval(
            'form[method="post"] input[name="website"], form[method="post"] input[name="url"], form[method="post"] input[id="url"]',
            (input) => !!input
          )
          .catch(() => false);
        if (hasWebsiteInput) {
          await page.fill(
            'form[method="post"] input[name="website"], form[method="post"] input[name="url"], form[method="post"] input[id="url"]',
            website,
            { timeout: 10000 }
          );
        } else {
          console.log(
            `${yellow}  - Input with name="website" does not exist${reset}`
          );
        }

        // AUTHOR
        const hasAuthorInput = await page
          .$eval(
            'form[method="post"] input[name="author"], form[method="post"] input[name="nama"], form[method="post"] input[id="name"]',
            (input) => !!input
          )
          .catch(() => false);
        if (hasAuthorInput) {
          await page.fill(
            'form[method="post"] input[name="author"], form[method="post"] input[name="nama"], form[method="post"] input[id="name"]',
            author,
            { timeout: 10000 }
          );
        } else {
          console.log(
            `${yellow}  - Input with name="author" or "nama" does not exist${reset}`
          );
        }

        // EMAIL
        const randomEmailIndex = Math.floor(Math.random() * emails.length);
        const email = emails[randomEmailIndex];
        const hasEmailInput = await page
          .$eval(
            'form[method="post"] input[name="email"], form[method="post"] input[id="email"]',
            (input) => !!input
          )
          .catch(() => false);
        if (hasEmailInput) {
          await page.fill(
            'form[method="post"] input[name="email"], form[method="post"] input[id="email"]',
            email,
            { timeout: 10000 }
          );
        } else {
          console.log(
            `${yellow}  - Input with name="email" does not exist${reset}`
          );
        }

        // COMMENT
        const randomIndex = Math.floor(Math.random() * comments.length);
        const comment = comments[randomIndex];
        const hasCommentTextarea = await page
          .$eval(
            `form[method="post"] textarea[name="comment"], form[method="post"] textarea[name="isi"], form[method="post"] textarea[id="comment"]`,
            (textarea) => !!textarea
          )
          .catch(() => false);
        if (hasCommentTextarea) {
          await page.fill(
            `form[method="post"] textarea[name="comment"], form[method="post"] textarea[name="isi"], form[method="post"] textarea[id="comment"]`,
            comment,
            { timeout: 10000 }
          );
          fs.appendFileSync(commentFilePath, url + "\n");
        } else {
          console.log(
            `${yellow}  - Textarea with name="comment" does not exist${reset}`
          );
        }
        console.log("\n");
      }
    } catch (error) {
      console.error(`${red}${error.message || error}\n${reset}`);

      // Close the context and start a new one
      await context.close();
      context = await (await browser).newContext();
      page = await context.newPage();
    }
  }
  // Get output length from outputFilePath
  let commentFileLength = fs
    .readFileSync(commentFilePath, "utf-8")
    .split("\n")
    .filter(Boolean).length;
  let formExistsFileLength = fs
    .readFileSync(formExistsFilePath, "utf-8")
    .split("\n")
    .filter(Boolean).length;
  console.log(
    `${green}\n\Form Exist telah selesai, ${formExistsFileLength} link tersimpan di ${blue}${formExistsFileName}${reset} ${green}dan ${commentFileLength} link tersimpan di ${reset}${blue}${commentFileName}${reset}`
  );
});
