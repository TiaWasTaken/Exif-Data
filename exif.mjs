import fs from "fs";
import path from "path";
import { exiftool } from "exiftool-vendored";
import chalk from "chalk";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let outputMode = "terminal"; // Default to terminal output

async function displayExif(imagePath) {
  try {
    const tags = await exiftool.read(imagePath);

    let output = `EXIF Data for ${imagePath}:\n\n`;
    let coloredOutput = chalk.bold.underline(
      `EXIF Data for ${chalk.green(imagePath)}:\n\n`,
    );

    for (const [key, value] of Object.entries(tags)) {
      if (key !== "errors" && key !== "warnings") {
        output += `${key}: ${value}\n`;
        coloredOutput += `${chalk.blue(key)}: ${value}\n`;
      }
    }

    // Add Google Maps link if GPS coordinates are available, otherwise display 'none'
    if (tags.GPSLatitude && tags.GPSLongitude) {
      const lat = convertDMSToDD(tags.GPSLatitude, tags.GPSLatitudeRef);
      const lon = convertDMSToDD(tags.GPSLongitude, tags.GPSLongitudeRef);
      const googleMapsLink = createGoogleMapsUrl({ lat, lon });
      output += `Google Maps Link: ${googleMapsLink}\n`;
      coloredOutput += `${chalk.blue("Google Maps Link")}: ${googleMapsLink}\n`;
    } else {
      output += "Google Maps Link: none\n`";
      coloredOutput += `${chalk.blue("Google Maps Link")}: none\n`;
    }

    output += "-----------\n";
    coloredOutput += chalk.yellow("-----------\n");

    if (outputMode === "file") {
      fs.appendFileSync("exif_output.txt", output);
    } else {
      console.log(coloredOutput);
    }
  } catch (error) {
    console.error(
      chalk.red(`Error reading EXIF data from ${imagePath}:`),
      error,
    );
  }
}

// Function to convert DMS (degrees, minutes, seconds) to decimal degrees (DD)
function convertDMSToDD(dms, ref) {
  const degrees = dms[0];
  const minutes = dms[1];
  const seconds = dms[2];
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (ref === "S" || ref === "W") {
    dd *= -1;
  }
  return dd;
}

// Function to create Google Maps URL from decimal degrees
function createGoogleMapsUrl(coords) {
  const { lat, lon } = coords;
  return `https://maps.google.com/?q=${lat},${lon}`;
}

function processDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(
        chalk.red(`Error reading directory ${directoryPath}:`),
        err,
      );
      return;
    }

    const imageFiles = files.filter(
      (file) =>
        fs.lstatSync(path.join(directoryPath, file)).isFile() &&
        /\.(jpe?g|png|tiff)$/i.test(file),
    );

    let processedCount = 0;

    imageFiles.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      displayExif(filePath).then(() => {
        processedCount++;
        if (processedCount === imageFiles.length) {
          if (outputMode === "file") {
            console.log(
              chalk.green(
                "\nAll images processed. Output written to exif_output.txt.",
              ),
            );
          } else {
            console.log(chalk.green("All images processed."));
          }
          exiftool.end(); // Properly close the exiftool process
        }
      });
    });
  });
}

// Function to prompt user for output mode
function promptUser() {
  rl.question(
    chalk.blue("\nSelect output mode: 1 for file, 2 for terminal: "),
    (answer) => {
      if (answer === "1") {
        outputMode = "file";
        if (fs.existsSync("exif_output.txt")) {
          fs.unlinkSync("exif_output.txt"); // Clear the file if it already exists
        }
        processDirectory(imagesDirectory);
        rl.close();
      } else if (answer === "2") {
        outputMode = "terminal";
        processDirectory(imagesDirectory);
        rl.close();
      } else {
        console.log(
          chalk.red(
            "\nInvalid selection. Please choose 1 for file or 2 for terminal.",
          ),
        );
        promptUser();
      }
    },
  );
}

// Directory containing the images
const imagesDirectory = path.join(__dirname, "images");
promptUser();
