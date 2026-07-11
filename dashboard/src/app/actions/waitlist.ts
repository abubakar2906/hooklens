'use server';

import { Resend } from 'resend';

export async function joinWaitlist(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address' };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  let audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  
  // Ignore the placeholder if the user didn't change it
  if (audienceId === 'your_audience_id') {
    audienceId = undefined;
  }

  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set. Simulating success for development.');
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  }

  const resend = new Resend(apiKey);

  try {
    if (audienceId) {
      // Best Practice: Add contact to a Resend Audience
      const { error } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });

      if (error) {
        console.error('Resend Contacts API Error:', error);
        return { error: error.message };
      }
    } else {
      // Fallback: Send an email notification if no Audience ID is configured
      const { error } = await resend.emails.send({
        from: 'Waitlist <onboarding@resend.dev>', 
        to: 'abubakaryinusa404@gmail.com', // Must match your verified Resend account email
        subject: 'New HookLens Waitlist Signup',
        html: `<p>A new user has joined the waitlist: <strong>${email}</strong></p>`,
      });
      
      if (error) {
        console.error('Resend Email API Error:', error);
        return { error: error.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error joining waitlist:', err);
    return { error: 'An unexpected error occurred.' };
  }
}
