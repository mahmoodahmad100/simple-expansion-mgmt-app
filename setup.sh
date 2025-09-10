#!/bin/bash

echo "🚀 Setting up Expansion Management System..."

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing"
    echo "Press Enter when ready to continue..."
    read
else
    echo "✅ .env file already exists"
fi

# Start database services
echo "🐳 Starting database services..."
docker compose up -d mysql mongodb redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Run migrations
echo "🗄️  Running database migrations..."
npm run migration:run

# Seed databases
echo "🌱 Seeding MySQL database..."
npm run seed:mysql

echo "🌱 Seeding MongoDB database..."
npm run seed:mongodb

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the application: npm run start:dev"
echo "2. Access the API at: http://localhost:3000/api/v1"
echo "3. Use the sample credentials from README.md"
echo ""
echo "�� Happy expanding!"
