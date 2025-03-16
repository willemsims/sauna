const fs = require('fs');
const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Check if MongoDB URI is defined
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: MONGODB_URI is not defined in your environment variables');
  console.log('Please check your .env.local file in the project root with your MongoDB connection string:');
  console.log('MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/sauna-finder?retryWrites=true&w=majority');
  process.exit(1);
}

const client = new MongoClient(uri);

async function importSaunas() {
  try {
    // Check if Excel file exists
    const filePath = path.join(process.cwd(), 'data', 'sauna-data.xlsx');
    if (!fs.existsSync(filePath)) {
      console.error(`ERROR: File not found: ${filePath}`);
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('sauna-finder');
    const saunasCollection = database.collection('saunas');
    
    // Clear existing data (optional)
    await saunasCollection.deleteMany({});
    console.log('Cleared existing data');
    
    // Read Excel file
    console.log(`Reading Excel file from: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`Found ${data.length} rows in Excel file`);
    
    // Transform data to match our schema
    const saunas = data.map(row => ({
      name: row.name || '',
      address: row.full_address || '',
      phone: row.phone || '',
      website: row.site || '',
      rating: parseFloat(row.rating) || 0,
      reviewCount: parseInt(row.reviews) || 0,
      photoUrl: row.photo || '/images/placeholder-sauna.jpg',
      description: row.description || row.about || '',
      province: (row.state || '').toLowerCase().replace(/\s+/g, '_'),
      city: (row.city || '').toLowerCase().replace(/\s+/g, '_'),
      country: row.country || 'Canada',
      location: {
        type: "Point",
        coordinates: [
          parseFloat(row.longitude) || 0,
          parseFloat(row.latitude) || 0
        ]
      },
      workingHours: row.working_hours || '',
      popularTimes: row.popular_times || '',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert all saunas into MongoDB
    if (saunas.length > 0) {
      const result = await saunasCollection.insertMany(saunas);
      console.log(`${result.insertedCount} saunas imported successfully`);
    } else {
      console.log('No saunas to import');
    }
    
  } catch (error) {
    console.error('Error importing saunas:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

importSaunas();
