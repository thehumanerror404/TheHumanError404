const mammoth = require("mammoth");
const fs = require("fs");

const filePath = process.argv[2];

if (!filePath) {
    console.error("Please provide a file path");
    process.exit(1);
}

mammoth.extractRawText({ path: filePath })
    .then(result => {
        console.log(result.value);
    })
    .catch(err => {
        console.error(err);
    });
