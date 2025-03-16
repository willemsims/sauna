import { MongoClient } from 'mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get('province');
  const city = searchParams.get('city');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const database = client.db('sauna-finder');
    const saunasCollection = database.collection('saunas');
    
    // Build query based on parameters
    const query = {};
    if (province) query.province = province;
    if (city) query.city = city;
    
    const saunas = await saunasCollection.find(query).toArray();
    
    return new Response(JSON.stringify(saunas), {
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
