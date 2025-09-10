const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expansion_mgmt';
const client = new MongoClient(uri);

async function seedMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('expansion_mgmt');
    const documentsCollection = db.collection('researchdocuments');

    // Clear existing documents
    await documentsCollection.deleteMany({});

    // Sample research documents
    const sampleDocuments = [
      {
        title: 'German Market Entry Legal Requirements',
        content: 'Comprehensive analysis of legal requirements for entering the German market, including company registration, compliance, and regulatory frameworks.',
        projectId: 1,
        tags: ['legal', 'compliance', 'germany', 'market-entry'],
        fileName: 'german-legal-analysis.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'French HR Regulations and Labor Laws',
        content: 'Detailed overview of French employment laws, HR practices, and recruitment requirements for foreign companies.',
        projectId: 2,
        tags: ['hr', 'recruitment', 'france', 'labor-laws'],
        fileName: 'french-hr-guide.pdf',
        fileSize: 1536000,
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Spanish Tax Optimization Strategies',
        content: 'Tax planning and optimization strategies for Spanish operations, including VAT, corporate tax, and international tax considerations.',
        projectId: 3,
        tags: ['tax', 'accounting', 'spain', 'optimization'],
        fileName: 'spanish-tax-strategies.pdf',
        fileSize: 3072000,
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Dutch IT Infrastructure Market Analysis',
        content: 'Market analysis of IT infrastructure and cloud migration opportunities in the Netherlands, including vendor landscape and pricing.',
        projectId: 4,
        tags: ['it', 'cloud-migration', 'netherlands', 'infrastructure'],
        fileName: 'dutch-it-market.pdf',
        fileSize: 2560000,
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'European Expansion Best Practices',
        content: 'Comprehensive guide to best practices for expanding into European markets, covering legal, HR, tax, and operational considerations.',
        projectId: 1,
        tags: ['best-practices', 'europe', 'expansion', 'guide'],
        fileName: 'european-expansion-guide.pdf',
        fileSize: 4096000,
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Vendor Selection Criteria Framework',
        content: 'Framework for evaluating and selecting vendors during international expansion, including scoring methodologies and due diligence checklists.',
        projectId: 2,
        tags: ['vendor-selection', 'framework', 'evaluation', 'due-diligence'],
        fileName: 'vendor-selection-framework.pdf',
        fileSize: 1792000,
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert documents
    const result = await documentsCollection.insertMany(sampleDocuments);
    console.log(`Inserted ${result.insertedCount} research documents`);

    // Create indexes for better performance
    await documentsCollection.createIndex({ projectId: 1 });
    await documentsCollection.createIndex({ tags: 1 });
    await documentsCollection.createIndex({ 
      title: 'text', 
      content: 'text' 
    });
    console.log('Created MongoDB indexes');

  } catch (error) {
    console.error('Error seeding MongoDB:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedMongoDB();
