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

export async function signUp(email: string, password: string, username: string, fullName: string) {
  console.log('Starting signUp function');
  await logError('Starting signUp function');
  console.log('Input data:', { email, username, fullName });
  await logError(`Input data: ${JSON.stringify({ email, username, fullName })}`);

  try {
    // Step 1: Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('Auth signUp result:', { authData, authError });
    await logError(`Auth signUp result: ${JSON.stringify({ authData, authError })}`);

    if (authError) {
      console.error('Error in auth.signUp:', authError);
      await logError(`Error in auth.signUp: ${JSON.stringify(authError)}`);
      throw authError;
    }

    if (authData.user) {
      console.log('User created successfully:', authData.user);
      await logError(`User created successfully: ${JSON.stringify(authData.user)}`);
      console.log('Attempting to insert profile');
      await logError('Attempting to insert profile');

      // Step 2: Create the user profile
      const profileData = { 
        id: authData.user.id, 
        username, 
        full_name: fullName,
      };
      console.log('Profile data to insert:', profileData);
      await logError(`Profile data to insert: ${JSON.stringify(profileData)}`);

      const { data: insertedProfile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('Error inserting profile:', profileError);
        console.error('Error details:', profileError.details);
        console.error('Error hint:', profileError.hint);
        console.error('Error message:', profileError.message);
        await logError(`Error inserting profile: ${JSON.stringify(profileError)}`);
        await logError(`Error details: ${profileError.details}`);
        await logError(`Error hint: ${profileError.hint}`);
        await logError(`Error message: ${profileError.message}`);
        throw profileError;
      }

      console.log('Profile inserted successfully:', insertedProfile);
      await logError(`Profile inserted successfully: ${JSON.stringify(insertedProfile)}`);

      return { user: authData.user, profile: insertedProfile };
    } else {
      console.log('No user data returned from auth.signUp');
      await logError('No user data returned from auth.signUp');
      throw new Error('Failed to create user');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    await logError(`Error during signup: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    await logError(`Error in signIn: ${JSON.stringify(error)}`);
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    await logError(`Error in signOut: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    await logError(`Error in getUserProfile: ${JSON.stringify(error)}`);
    throw error;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: { username?: string, full_name?: string, avatar_url?: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    await logError(`Error in updateUserProfile: ${JSON.stringify(error)}`);
    throw error;
  }

  return data;
}
