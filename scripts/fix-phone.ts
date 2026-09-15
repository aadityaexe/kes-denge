import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env");
  process.exit(1);
}

// Simple schema to interact with Setting
const settingSchema = new mongoose.Schema({}, { strict: false });
const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    const setting = await Setting.findOne();
    
    if (setting) {
      if (setting.contactPhone === "123456879" || setting.contactPhone?.includes("dummy") || setting.contactPhone?.includes("placeholder")) {
        console.log("Found dummy phone number:", setting.contactPhone);
        
        await Setting.updateOne(
          { _id: setting._id },
          { $set: { contactPhone: "" } }
        );
        console.log("Successfully cleared dummy phone number.");
      } else {
        console.log("No dummy phone number found. Current phone:", setting.contactPhone);
      }
    } else {
      console.log("No Settings document found.");
    }
  } catch (err) {
    console.error("Error connecting to database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

main().catch(console.error);
