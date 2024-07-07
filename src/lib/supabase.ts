import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oazeymuyzghnlmgbfvnc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hemV5bXV5emdobmxtZ2Jmdm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk4NDI4ODksImV4cCI6MjAzNTQxODg4OX0.50Av9W7k6GG6dEiyf9TKupwtE92mBEoCBH7Ps8Sw4rU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function logError(message: string) {
  try {
    const response = await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      console.error('Failed to log error:', await response.text());
    }
  } catch (error) {
    console.error('Failed to log error:', error);
  }
}

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  try {
    // Sign up the user
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      await logError(`Error in signUp: ${JSON.stringify(error)}`);
      throw error;
    }

    // If user is created successfully, create a profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: user.user.id, first_name: firstName, last_name: lastName }
      ]);

    if (profileError) {
      await logError(`Error in profile creation: ${JSON.stringify(profileError)}`);
      throw profileError;
    }

    return user;
  } catch (error) {
    console.error('Error during signup:', error);
    await logError(`Error during signup: ${JSON.stringify(error)}`);
    throw error;
  }
}
