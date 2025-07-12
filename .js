const fs = require("fs");
const path = require("path");

const folderPath = "./imgs_explode"; // Change this to your folder

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const match = file.match(/^img_(\d+)(\.\w+)$/);
    if (match) {
      const [_, number, ext] = match;
      const oldPath = path.join(folderPath, file);
      const newPath = path.join(folderPath, `${number}_img${ext}`);
      fs.rename(oldPath, newPath, (err) => {
        if (err) console.error("Rename failed:", err);
        else console.log(`Renamed: ${file} → ${number}_img${ext}`);
      });
    }
  });
});
