// sc.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateUsers() {
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name');

    if (usersError) throw usersError;
    if (!users) throw new Error('No users found');

    console.log(`Found ${users.length} users. Updating auth metadata...`);

    for (const user of users) {
      if (!user.id || !user.full_name) continue;

      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { full_name: user.full_name },
      });

      if (error) {
        console.error(`Failed to update user ${user.id}:`, error.message);
      } else {
        console.log(`✅ Updated user ${user.id} with full_name: ${user.full_name}`);
      }
    }

    console.log('All done!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

updateUsers();
