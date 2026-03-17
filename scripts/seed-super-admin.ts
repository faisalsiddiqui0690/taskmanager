import sequelize from '../lib/db';
import { User } from '../models/User';
import { hashPassword } from '../lib/auth';

async function seed() {
  try {
    await sequelize.authenticate();
    
    const email = 'superadmin@taskmanager.com';
    const password = 'SuperAdminPassword123!';
    const hashedPassword = await hashPassword(password);
    
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'super_admin'
      }
    });
    
    if (created) {
      console.log('Super Admin created successfully.');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      // Update existing user to super_admin if it exists
      user.set('role', 'super_admin');
      user.set('password', hashedPassword);
      await user.save();
      console.log('Existing user updated to Super Admin.');
      console.log('Email:', email);
      console.log('Password:', password);
    }
  } catch (e: any) {
    console.error('Error seeding Super Admin:', e.message);
  } finally {
    process.exit(0);
  }
}

seed();
