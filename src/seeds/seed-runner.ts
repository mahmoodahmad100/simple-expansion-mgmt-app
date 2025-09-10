import { DataSource } from 'typeorm';
import { seedDatabase } from './seed';

async function runSeeds() {
  // Create a mock config for seeding
  const config = {
    type: 'mysql' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'expansion_mgmt',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: false,
  };

  const dataSource = new DataSource(config);

  try {
    await dataSource.initialize();
    console.log('Connected to database');
    
    await seedDatabase(dataSource);
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();
