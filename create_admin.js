const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function makeSuperAdmin() {
  const email = 'info@peptidespanama.net';
  const password = 'Qwerty@123';
  const name = 'Joey Webster';

  console.log(`Checking if user ${email} exists...`);
  
  // Try to create the user
  let { data: { user }, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes('already exists') || error.status === 422) {
      console.log('User already exists, fetching user id...');
      // Fetch user via admin API
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
      }
      user = usersData.users.find(u => u.email === email);
      if (!user) {
        console.error('Could not find user in list');
        return;
      }
      // Update password just in case
      await supabase.auth.admin.updateUserById(user.id, { password });
    } else {
      console.error('Error creating user:', error);
      return;
    }
  }

  console.log('User ID:', user.id);

  console.log('Upserting into admin_profiles...');
  const { error: profileError } = await supabase
    .from('admin_profiles')
    .upsert({
      user_id: user.id,
      email: email,
      name: name,
      is_superadmin: true,
      permissions: ['orders', 'customers', 'leads', 'analytics', 'marketing', 'settings']
    }, { onConflict: 'email' });

  if (profileError) {
    console.error('Error creating admin profile:', profileError);
  } else {
    console.log('Super admin created successfully!');
  }
}

makeSuperAdmin();
