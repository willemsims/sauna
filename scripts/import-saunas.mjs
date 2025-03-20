/**
 * Import Saunas Script
 * 
 * This script imports sauna data from an Excel file into MongoDB.
 * 
 * To run this script:
 * node scripts/import-saunas.mjs
 * 
 * Make sure:
 * 1. Your .env.local file contains the MONGODB_URI variable
 * 2. The Excel file exists at data/saunas.xlsx
 */

import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in your .env.local file');
  process.exit(1);
}

console.log('MongoDB URI:', process.env.MONGODB_URI.substring(0, 20) + '...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sauna_tourist'  // Specify the database name here
})
  .then(() => console.log('Connected to MongoDB (sauna_tourist)'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Import Sauna model dynamically
const { default: Sauna } = await import('../models/Sauna.js');

// Function to safely convert a value to lowercase
function safeToLowerCase(value) {
  return value && typeof value === 'string' ? value.toLowerCase() : '';
}

// Function to truncate text to a maximum length
function truncate(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

// Function to import saunas from Excel
async function importSaunas() {
  try {
    // Read Excel file
    const excelFilePath = path.resolve(process.cwd(), 'data', 'saunas.xlsx');
    
    // Check if the Excel file exists
    if (!fs.existsSync(excelFilePath)) {
      console.error(`Error: Excel file not found at ${excelFilePath}`);
      process.exit(1);
    }
    
    // Read the Excel file
    const workbook = XLSX.readFile(excelFilePath);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON
    const records = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${records.length} records in Excel file`);
    
    // Print the first record to see its structure
    if (records.length > 0) {
      console.log('First record structure:');
      console.log(JSON.stringify(records[0], null, 2));
    }
    
    // Process each record
    let successCount = 0;
    let errorCount = 0;
    
    // Show progress indicator
    console.log('Importing saunas...');
    
    for (const record of records) {
      try {
        // Skip records without required fields
        if (!record.name) {
          console.warn('Skipping record: Missing name field');
          errorCount++;
          continue;
        }
        
        // Extract address from full_address or use street
        const address = record.full_address || record.street || '';
        
        // Truncate long text fields to fit schema constraints
        const name = truncate(record.name, 100);
        let description = '';
        if (record.about) {
          try {
            // Try to keep the JSON structure but truncate if needed
            const aboutObj = typeof record.about === 'string' ? JSON.parse(record.about) : record.about;
            description = truncate(JSON.stringify(aboutObj), 1000);
          } catch (e) {
            description = truncate(String(record.about), 1000);
          }
        }
        
        // Convert empty strings to null for certain fields
        const processedRecord = {
          name: name,
          description: description,
          address: address,
          city: safeToLowerCase(record.city || 'unknown'),
          province: safeToLowerCase(record.state || 'unknown'),
          postalCode: record.postal_code || '',
          country: record.country || 'Canada',
          phone: record.phone || '',
          email: record.email || '',
          website: record.site || '',
          photoUrl: record.photo || '',
          rating: parseFloat(record.rating) || 0,
          reviewCount: parseInt(record.reviews) || 0,
          
          // Location data if available
          location: record.latitude && record.longitude ? {
            type: 'Point',
            coordinates: [parseFloat(record.longitude), parseFloat(record.latitude)]
          } : undefined,
          
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
          // Update existing sauna without logging
          await Sauna.findByIdAndUpdate(existingSauna._id, processedRecord);
        } else {
          // Create new sauna without logging
          await Sauna.create(processedRecord);
        }
        
        successCount++;
        
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