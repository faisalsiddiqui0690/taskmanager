import sequelize from './lib/db';

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.query("ALTER TABLE Tasks ADD COLUMN assignedTo INT REFERENCES Users(id);");
    console.log("Successfully added assignedTo column.");
  } catch (e: any) {
    if (e.message.includes("Duplicate column name")) {
      console.log("Column already exists.");
    } else {
      console.error("Error adding column:", e.message);
    }
  } finally {
    process.exit(0);
  }
}
run();
