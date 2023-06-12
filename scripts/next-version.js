const path = require("path");
const fs = require("fs");

let packageJSONPath = path.join(__dirname, "../package.json");

(async () => {
  try {
    const fileContent = await fs.readFileSync(packageJSONPath, "utf8");
    let json = JSON.parse(fileContent);
    const version = json.version;
    const newVersion = +version + 1;
    json.version = newVersion.toString();
    await fs.unlinkSync(packageJSONPath);
    await fs.writeFileSync(packageJSONPath, JSON.stringify(json));
    console.log("Versioning completed 100%. Building application now");
  } catch (e) {
    console.error(e);
    console.warn("Something went wrong while setting new version, Please check above error and use git to recover package.json");
  }
})();
