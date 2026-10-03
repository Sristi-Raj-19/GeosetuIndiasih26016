// GeoSetu-India Database Seeder CLI
require('../config/db');
const { getSupabase, isConfigured } = require('../config/db');
const seedData = require('../data/seedData');

async function seed() {
  console.log('🌱 Starting GeoSetu-India Supabase Database Seeding...');

  if (!isConfigured()) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env to run this script.');
    process.exit(1);
  }

  const sb = getSupabase();

  try {
    console.log('Inserting benchmark users...');
    for (const u of seedData.SEED_USERS) {
      const { error } = await sb.from('users').upsert({
        id: u.id,
        username: u.username,
        email: u.email,
        password_hash: u.password,
        full_name: u.full_name,
        role: u.role,
        designation: u.designation,
        phone: u.phone
      }, { onConflict: 'id' });
      if (error) console.warn('User upsert notice:', error.message);
    }

    console.log('Inserting benchmark owners...');
    for (const o of seedData.SEED_OWNERS) {
      await sb.from('owners').upsert(o, { onConflict: 'id' });
    }

    console.log('Inserting benchmark projects...');
    for (const p of seedData.SEED_PROJECTS) {
      await sb.from('projects').upsert(p, { onConflict: 'id' });
    }

    console.log('Inserting benchmark parcels...');
    for (const pc of seedData.SEED_PARCELS) {
      await sb.from('parcels').upsert(pc, { onConflict: 'id' });
    }

    console.log('Inserting benchmark cases...');
    for (const cs of seedData.SEED_CASES) {
      await sb.from('cases').upsert(cs, { onConflict: 'id' });
    }

    console.log('Inserting benchmark agreements...');
    for (const ag of seedData.SEED_AGREEMENTS) {
      await sb.from('agreements').upsert(ag, { onConflict: 'id' });
    }

    console.log('✅ Supabase database successfully seeded with benchmark data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
