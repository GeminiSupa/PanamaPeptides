// Creates (or promotes) a super admin.
//
// Usage:
//   node create_admin.js <email> <password> ["Full Name"]
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const [, , email, password, name = 'Super Admin'] = process.argv;

if (!email || !password) {
  console.error('Usage: node create_admin.js <email> <password> ["Full Name"]');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findUserByEmail(target) {
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase());
    if (match || data.users.length < 1000) return match || null;
  }
}

async function makeSuperAdmin() {
  console.log(`Creating super admin ${email}...`);

  let user = null;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    user = await findUserByEmail(email);
    if (!user) {
      console.error('Error creating user:', error.message);
      process.exit(1);
    }
    console.log('User already exists; setting the new password and confirming the email.');
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });
    if (updateError) {
      console.error('Error updating user:', updateError.message);
      process.exit(1);
    }
  } else {
    user = data.user;
  }

  const { error: profileError } = await supabase
    .from('admin_profiles')
    .upsert({
      user_id: user.id,
      email,
      name,
      is_superadmin: true,
      permissions: ['orders', 'customers', 'leads', 'analytics', 'marketing', 'settings'],
    }, { onConflict: 'email' });

  if (profileError) {
    console.error('Error creating admin profile:', profileError.message);
    process.exit(1);
  }

  console.log('Super admin ready. Log in at /admin with that email and password.');
}

makeSuperAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
