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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      await logError(`Error in signUp: ${JSON.stringify(authError)}`);
      throw authError;
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });

      if (profileError) {
        await logError(`Error creating profile: ${JSON.stringify(profileError)}`);
        throw profileError;
      }
    }

    return authData;
  } catch (error) {
    console.error('Error during signup:', error);
    await logError(`Error during signup: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      await logError(`Error in signIn: ${JSON.stringify(error)}`);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error during sign in:', error);
    await logError(`Error during sign in: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      await logError(`Error in signOut: ${JSON.stringify(error)}`);
      throw error;
    }
  } catch (error) {
    console.error('Error during sign out:', error);
    await logError(`Error during sign out: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function getUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    await logError(`Error getting user: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
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
  } catch (error) {
    console.error('Error getting user profile:', error);
    await logError(`Error getting user profile: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: { first_name?: string, last_name?: string, email?: string }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      await logError(`Error in updateUserProfile: ${JSON.stringify(error)}`);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    await logError(`Error updating user profile: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function updateUserEmail(newEmail: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      await logError(`Error in updateUserEmail: ${JSON.stringify(error)}`);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user email:', error);
    await logError(`Error updating user email: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function updateUserPassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      await logError(`Error in updateUserPassword: ${JSON.stringify(error)}`);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user password:', error);
    await logError(`Error updating user password: ${JSON.stringify(error)}`);
    throw error;
  }
}
