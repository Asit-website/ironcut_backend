const fs = require("fs");

const removeUndefined = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([e, f]) => f));
};

if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

module.exports = {
    removeUndefined
};
