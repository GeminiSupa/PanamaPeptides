require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: `
    CREATE OR REPLACE FUNCTION increment_promo_usage(p_code text)
    RETURNS void AS $$
    BEGIN
      UPDATE promo_codes SET usage_count = COALESCE(usage_count, 0) + 1 WHERE code = p_code;
    END;
    $$ LANGUAGE plpgsql;

    ALTER TABLE promo_code_usage_log ADD CONSTRAINT promo_code_usage_log_unique_customer_promo UNIQUE (customer_email, promo_code);
  ` });
  console.log(error || 'Success');
}
run();
