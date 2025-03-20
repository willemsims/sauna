/**
 * Import Saunas Script
 * 
 * This script imports sauna data from a CSV file into MongoDB.
 * 
 * To run this script:
 * node scripts/import-saunas.js
 * 
 * Make sure:
 * 1. Your .env file contains the MONGODB_URI variable
 * 2. The CSV file exists at data/saunas.csv
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB with the correct database name
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sauna_tourist'  // Specify the database name here
})
  .then(() => console.log('Connected to MongoDB (sauna_tourist)'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Import Sauna model - using CommonJS require
const Sauna = require('../models/Sauna');

// Function to safely format location names (lowercase and normalize spaces)
function formatLocationName(name) {
  if (!name) return '';
  return name.toLowerCase().trim();
}

// Function to import saunas from CSV
async function importSaunas() {
  try {
    // Read CSV file
    const csvFilePath = path.resolve(process.cwd(), 'data', 'saunas.csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`Found ${records.length} records in CSV file`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each record
    for (const record of records) {
      try {
        // Convert empty strings to null for certain fields
        const processedRecord = {
          name: record.name,
          description: record.description || '',
          address: record.address,
          city: formatLocationName(record.city),
          province: formatLocationName(record.province),
          postalCode: record.postalCode || '',
          country: record.country || 'Canada',
          phone: record.phone || '',
          email: record.email || '',
          website: record.website || '',
          photoUrl: record.photoUrl || '',
          rating: parseFloat(record.rating) || 0,
          reviewCount: parseInt(record.reviewCount) || 0,
          priceRange: record.priceRange || '$$',
          
          // Process category fields - convert empty cells to empty strings
          traditional: record.traditional === 'Y' ? 'Y' : (record.traditional === 'N' ? 'N' : ''),
          wood: record.wood === 'Y' ? 'Y' : (record.wood === 'N' ? 'N' : ''),
          infrared: record.infrared === 'Y' ? 'Y' : (record.infrared === 'N' ? 'N' : ''),
          hot_tub: record.hot_tub === 'Y' ? 'Y' : (record.hot_tub === 'N' ? 'N' : ''),
          cold_plunge: record.cold_plunge === 'Y' ? 'Y' : (record.cold_plunge === 'N' ? 'N' : ''),
          steam: record.steam === 'Y' ? 'Y' : (record.steam === 'N' ? 'N' : ''),
          private: record.private === 'Y' ? 'Y' : (record.private === 'N' ? 'N' : ''),
          public: record.public === 'Y' ? 'Y' : (record.public === 'N' ? 'N' : ''),
          mobile: record.mobile === 'Y' ? 'Y' : (record.mobile === 'N' ? 'N' : ''),
          gay: record.gay === 'Y' ? 'Y' : (record.gay === 'N' ? 'N' : ''),
          featured: record.featured === 'Y' ? 'Y' : (record.featured === 'N' ? 'N' : '')
        };
        
        // Check if sauna already exists
        const existingSauna = await Sauna.findOne({ 
          name: processedRecord.name,
          city: processedRecord.city
        });
        
        if (existingSauna) {
          // Update existing sauna without logging details
          await Sauna.findByIdAndUpdate(existingSauna._id, processedRecord);
          successCount++;
        } else {
          // Create new sauna without logging details
          await Sauna.create(processedRecord);
          successCount++;
        }
        
        // Show progress every 50 records
        if (successCount % 50 === 0) {
          console.log(`Progress: ${successCount}/${records.length} records processed`);
        }
      } catch (recordError) {
        console.error(`Error processing record: ${record.name || 'Unknown'}`, recordError.message);
        errorCount++;
      }
    }
    
    console.log(`Import completed: ${successCount} successful, ${errorCount} errors`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing saunas:', error);
    process.exit(1);
  }
}

// Run the import function
importSaunas();
