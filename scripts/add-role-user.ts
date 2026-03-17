import sequelize from '../lib/db';


async function run() {
  try {
    await sequelize.authenticate();
    // Use ENUM type if supported by dialect, otherwise VARCHAR
    // For MySQL (which seems to be used here):
    await sequelize.query("ALTER TABLE Users ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user';");
    console.log("Successfully added role column to Users table.");
  } catch (e: any) {
    if (e.message.includes("Duplicate column name")) {
      console.log("Column 'role' already exists.");
    } else {
      console.error("Error adding column:", e.message);
    }
  } finally {
    process.exit(0);
  }
}
run();
