import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oazeymuyzghnlmgbfvnc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hemV5bXV5emdobmxtZ2Jmdm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk4NDI4ODksImV4cCI6MjAzNTQxODg4OX0.50Av9W7k6GG6dEiyf9TKupwtE92mBEoCBH7Ps8Sw4rU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signUp(email: string, password: string, username: string, fullName: string) {
  console.log('Starting signUp function');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log('Auth signUp result:', { data, error });

  if (error) {
    console.error('Error in auth.signUp:', error);
    throw error;
  }

  if (data.user) {
    console.log('User created, inserting profile');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ 
        id: data.user.id, 
        username, 
        full_name: fullName,
      });

    if (profileError) {
      console.error('Error inserting profile:', profileError);
      throw profileError;
    }
    console.log('Profile inserted successfully');
  } else {
    console.log('No user data returned from auth.signUp');
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
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
    throw error;
  }

  return data;
}
