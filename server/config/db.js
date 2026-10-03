const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const seedData = require('../data/seedData');

// Runtime in-memory store for fallback/caching & rapid persistence
const memoryStore = {
  users: [...seedData.SEED_USERS],
  owners: [...seedData.SEED_OWNERS],
  projects: [...seedData.SEED_PROJECTS],
  parcels: [...seedData.SEED_PARCELS],
  cases: [...seedData.SEED_CASES],
  agreements: [...seedData.SEED_AGREEMENTS],
  compensation: [...seedData.SEED_COMPENSATION],
  documents: [...seedData.SEED_DOCUMENTS],
  approvals: [...seedData.SEED_APPROVALS],
  alerts: [...seedData.SEED_ALERTS],
  audit: [...seedData.SEED_AUDIT_LOGS]
};

let currentUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL || '';
let currentKey = process.env.DATABASE_KEY || process.env.SUPABASE_ANON_KEY || '';
let dbClient = null;

function initClient() {
  if (currentUrl && currentKey && currentUrl.startsWith('http')) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      dbClient = createClient(currentUrl, currentKey, {
        auth: { persistSession: false },
        db: { schema: 'public' }
      });
      console.log('✅ Database client initialized with URL:', currentUrl);
    } catch (err) {
      dbClient = null;
    }
  } else {
    dbClient = null;
  }
}

initClient();

async function testConnection(url = currentUrl, key = currentKey) {
  if (!url || !key) {
    return { ok: false, error: 'Database URL and API Key are required.' };
  }
  try {
    const { createClient } = require('@supabase/supabase-js');
    const tempClient = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await tempClient.from('users').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return { ok: true, warning: 'Connected to Database, but tables are pending creation.' };
      }
      return { ok: false, error: error.message || 'Database query error' };
    }
    return { ok: true, message: 'Successfully connected to Cloud Database.' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function updateCredentials(url, key) {
  currentUrl = (url || '').trim();
  currentKey = (key || '').trim();
  initClient();

  try {
    const envContent = `# GeoSetu-India Environment Configuration\nPORT=${process.env.PORT || 8080}\nDATABASE_URL=${currentUrl}\nDATABASE_KEY=${currentKey}\n`;
    fs.writeFileSync(envPath, envContent, 'utf8');
  } catch (e) {
    console.warn('Could not write to .env file:', e.message);
  }
}

module.exports = {
  getDb: () => dbClient,
  getSupabase: () => dbClient,
  isConfigured: () => Boolean(dbClient),
  getCredentials: () => ({ url: currentUrl, key: currentKey ? currentKey.slice(0, 8) + '...' : '' }),
  updateCredentials,
  testConnection,
  memoryStore
};
