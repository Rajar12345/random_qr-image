import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";
import { randomBytes } from 'crypto';

const domains = ["google.com", "youtube.com"];

const getRandomDomain = () => {
  const randomIndex = Math.floor(Math.random() * domains.length);
  return domains[randomIndex];
};

const getRandomURL = () => {
  const domain = getRandomDomain();
  const randomBytesHex = randomBytes(8).toString('hex'); // Generate 8 random bytes for a unique URL
  return `https://www.${domain}/${randomBytesHex}`;
};

inquirer
  .prompt([
    {
      type: "confirm",
      message: "Do you want to generate a QR code from a random URL?",
      name: "useRandomURL",
    },
  ])
  .then((answers) => {
    let url;
    if (answers.useRandomURL) {
      url = getRandomURL();
    } else {
      url = inquirer.prompt([
        {
          message: "Type in your URL: ",
          name: "URL",
        },
      ]).then((answers) => answers.URL);
    }

    return url;
  })
  .then((url) => {
    var qr_svg = qr.image(url);
    qr_svg.pipe(fs.createWriteStream("qr_img.png"));

    fs.writeFile("URL.txt", url, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
