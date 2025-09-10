-- Initialize expansion_mgmt database
USE expansion_mgmt;

-- Create sample clients
INSERT INTO clients (email, password, company_name, role, created_at, updated_at) VALUES
('admin@expansionmgmt.com', '$2a$10$rQZ8NwYzX9K2M1L3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z', 'Expansion Management Admin', 'admin', NOW(), NOW()),
('client1@example.com', '$2a$10$rQZ8NwYzX9K2M1L3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z', 'Tech Startup Inc', 'client', NOW(), NOW()),
('client2@example.com', '$2a$10$rQZ8NwYzX9K2M1L3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z', 'Global Enterprises Ltd', 'client', NOW(), NOW());

-- Create sample vendors
INSERT INTO vendors (name, countries_supported, services_offered, rating, response_sla_hours, created_at, updated_at) VALUES
('Legal Partners International', 'Germany,France,Spain', 'legal_services,compliance,contract_negotiation', 4.5, 24, NOW(), NOW()),
('Tax Solutions Pro', 'Germany,Netherlands,Belgium', 'tax_services,accounting,financial_planning', 4.2, 48, NOW(), NOW()),
('HR Expansion Experts', 'France,Spain,Italy', 'hr_services,recruitment,payroll', 4.8, 12, NOW(), NOW()),
('Tech Infrastructure Corp', 'Germany,Netherlands,Sweden', 'it_services,cloud_migration,cybersecurity', 4.6, 36, NOW(), NOW()),
('Marketing Masters EU', 'France,Germany,Italy', 'marketing,digital_advertising,branding', 4.3, 24, NOW(), NOW());

-- Create sample projects
INSERT INTO projects (client_id, country, services_needed, budget, status, created_at, updated_at) VALUES
(2, 'Germany', 'legal_services,compliance', 50000.00, 'active', NOW(), NOW()),
(2, 'France', 'hr_services,recruitment', 75000.00, 'active', NOW(), NOW()),
(3, 'Spain', 'tax_services,accounting', 45000.00, 'draft', NOW(), NOW()),
(3, 'Netherlands', 'it_services,cloud_migration', 120000.00, 'active', NOW(), NOW());
