import { DataSource } from 'typeorm';
import { Client, UserRole } from '../auth/entities/client.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Match } from '../matches/entities/match.entity';
import * as bcrypt from 'bcryptjs';

export async function seedDatabase(dataSource: DataSource) {
  const clientRepository = dataSource.getRepository(Client);
  const vendorRepository = dataSource.getRepository(Vendor);
  const projectRepository = dataSource.getRepository(Project);
  const matchRepository = dataSource.getRepository(Match);

  // Clear existing data
  await matchRepository.clear();
  await projectRepository.clear();
  await vendorRepository.clear();
  await clientRepository.clear();

  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 10);
  const admin = await clientRepository.save({
    email: 'admin@expansionmgmt.com',
    password: adminPassword,
    company_name: 'Expansion Management Admin',
    role: UserRole.ADMIN,
  });

  // Create client users
  const client1Password = await bcrypt.hash('password123', 10);
  const client1 = await clientRepository.save({
    email: 'client1@example.com',
    password: client1Password,
    company_name: 'Tech Startup Inc',
    role: UserRole.CLIENT,
  });

  const client2Password = await bcrypt.hash('password123', 10);
  const client2 = await clientRepository.save({
    email: 'client2@example.com',
    password: client2Password,
    company_name: 'Global Enterprises Ltd',
    role: UserRole.CLIENT,
  });

  // Create vendors
  const vendors = await vendorRepository.save([
    {
      name: 'Legal Partners International',
      countries_supported: ['Germany', 'France', 'Spain'],
      services_offered: ['legal_services', 'compliance', 'contract_negotiation'],
      rating: 4.5,
      response_sla_hours: 24,
    },
    {
      name: 'Tax Solutions Pro',
      countries_supported: ['Germany', 'Netherlands', 'Belgium'],
      services_offered: ['tax_services', 'accounting', 'financial_planning'],
      rating: 4.2,
      response_sla_hours: 48,
    },
    {
      name: 'HR Expansion Experts',
      countries_supported: ['France', 'Spain', 'Italy'],
      services_offered: ['hr_services', 'recruitment', 'payroll'],
      rating: 4.8,
      response_sla_hours: 12,
    },
    {
      name: 'Tech Infrastructure Corp',
      countries_supported: ['Germany', 'Netherlands', 'Sweden'],
      services_offered: ['it_services', 'cloud_migration', 'cybersecurity'],
      rating: 4.6,
      response_sla_hours: 36,
    },
    {
      name: 'Marketing Masters EU',
      countries_supported: ['France', 'Germany', 'Italy'],
      services_offered: ['marketing', 'digital_advertising', 'branding'],
      rating: 4.3,
      response_sla_hours: 24,
    },
  ]);

  // Create projects
  const projects = await projectRepository.save([
    {
      client_id: client1.id,
      country: 'Germany',
      services_needed: ['legal_services', 'compliance'],
      budget: 50000.00,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_id: client1.id,
      country: 'France',
      services_needed: ['hr_services', 'recruitment'],
      budget: 75000.00,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_id: client2.id,
      country: 'Spain',
      services_needed: ['tax_services', 'accounting'],
      budget: 45000.00,
      status: ProjectStatus.DRAFT,
    },
    {
      client_id: client2.id,
      country: 'Netherlands',
      services_needed: ['it_services', 'cloud_migration'],
      budget: 120000.00,
      status: ProjectStatus.ACTIVE,
    },
  ]);

  // Create some initial matches
  const matches = await matchRepository.save([
    {
      project_id: projects[0].id,
      vendor_id: vendors[0].id,
      score: 85.5,
    },
    {
      project_id: projects[1].id,
      vendor_id: vendors[2].id,
      score: 92.8,
    },
    {
      project_id: projects[3].id,
      vendor_id: vendors[3].id,
      score: 88.6,
    },
  ]);

  console.log('Database seeded successfully!');
  console.log(`Created ${await clientRepository.count()} clients`);
  console.log(`Created ${await vendorRepository.count()} vendors`);
  console.log(`Created ${await projectRepository.count()} projects`);
  console.log(`Created ${await matchRepository.count()} matches`);
}
