import sequelize from '../lib/db';

async function run() {
  try {
    await sequelize.authenticate();
    // Update the ENUM column for MySQL
    // First, we need to check if we can just alter it. 
    // Usually: ALTER TABLE Users MODIFY COLUMN role ENUM('super_admin', 'admin', 'employee') DEFAULT 'employee';
    await sequelize.query("ALTER TABLE Users MODIFY COLUMN role ENUM('super_admin', 'admin', 'employee') DEFAULT 'employee';");
    console.log("Successfully updated role column options in Users table.");
  } catch (e: any) {
    console.error("Error updating column:", e.message);
  } finally {
    process.exit(0);
  }
}
run();
