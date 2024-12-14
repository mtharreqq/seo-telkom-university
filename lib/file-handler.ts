const fs = require("fs");
const path = require("path");
import { blue, green, red, reset, yellow } from "./color-terminal";

// Check if this path exist or not
export function isFolderExist(folderName: string) {
  const mainDir = path.dirname(__dirname);
  const dirPath = path.join(mainDir, folderName);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`${green}Directory created:${reset} ${dirPath}`);
  } else {
    console.log(`${yellow}Directory already exists:${reset} ${dirPath}`);
  }
  return dirPath;
}

// Fungsi untuk mengecek dan membuat file .txt jika belum ada
export function isFileExist(directoryPath: string, fileName: string) {
  const filePath = path.join(directoryPath, fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf8");
    console.log(`${green}File created:${reset} ${filePath}`);
  } else {
    console.log(`${yellow}File already exists:${reset} ${filePath}`);
  }
  return filePath;
}

// Delete all content in selected file
export function clearFileContent(filePath: string): void {
  const fileName = filePath.substring(filePath.lastIndexOf("\\") + 1);
  fs.truncate(filePath, 0, (err: any) => {
    if (err) {
      console.error(`${red}Error deleted file ${fileName}.${reset}`);
    } else {
      console.log(`${green}File ${fileName} deleted successfully.${reset}`);
    }
  });
}

// Function to read URLs from a file and return as an array
export function getUrlsFromFile(filePath: string) {
  return fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
}
