const mongoose = require("mongoose");

mongoose.connect(
"mongodb+srv://<db_username>:sandhya14@careapp.ihlzhux.mongodb.net/?appName=careapp"
)
.then(() => {
    console.log("✅ Connected");
    process.exit();
})
.catch((err) => {
    console.log("❌ Failed");
    console.log(err);
    process.exit();
});