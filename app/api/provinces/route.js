import { MongoClient } from 'mongodb';

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const database = client.db('sauna_tourist');
    const saunasCollection = database.collection('saunas');
    
    // Get unique provinces with their cities
    const provinces = await saunasCollection.aggregate([
      {
        $group: {
          _id: "$province",
          name: { $first: "$province" },
          cities: { 
            $addToSet: { 
              slug: "$city",
              name: "$city" 
            }
          }
        }
      },
      { $sort: { name: 1 } }
    ]).toArray();
    
    // Format the data to match your existing structure
    const formattedProvinces = provinces.map(province => {
      const formattedCities = {};
      province.cities.forEach(city => {
        formattedCities[city.slug] = {
          name: city.name.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        };
      });
      
      return {
        [province._id]: {
          name: province.name.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          cities: formattedCities
        }
      };
    });
    
    // Merge all province objects into one
    const locationData = formattedProvinces.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    
    return new Response(JSON.stringify(locationData), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  } finally {
    await client.close();
  }
}
