import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HookLens — Webhook gateway for fintech developers',
  description:
    'Self-hosted webhook gateway that normalises ingestion from Paystack, Flutterwave, and Monnify with guaranteed delivery, automatic retries, and AI-assisted failure diagnostics.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#ffffff',
          colorBackground: '#000000',
        }
      }}
    >
      <html lang="en" className={inter.variable}>
        <body className={inter.className}>
          <style dangerouslySetInnerHTML={{ __html: `
            .cl-rootBox * { border-color: #23252a !important; }
            .cl-card { background-color: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
            .cl-headerTitle { color: #ffffff !important; font-size: 24px !important; font-weight: 600 !important; letter-spacing: -0.03em !important; }
            .cl-headerSubtitle { color: #a1a1aa !important; font-size: 13px !important; }
            .cl-socialButtonsBlockButton { background-color: #18181b !important; border: 1px solid #23252a !important; color: #ffffff !important; border-radius: 8px !important; height: 36px !important; }
            .cl-socialButtonsBlockButton:hover { background-color: #23252a !important; }
            .cl-socialButtonsBlockButtonText { color: #ffffff !important; font-weight: 500 !important; }
            .cl-dividerLine { background-color: #23252a !important; }
            .cl-dividerText { color: #71717a !important; font-size: 12px !important; }
            .cl-formFieldLabel { color: #a1a1aa !important; font-size: 13px !important; margin-bottom: 6px !important; font-weight: 400 !important; }
            .cl-formFieldInput { background-color: #18181b !important; border: 1px solid #23252a !important; color: #ffffff !important; border-radius: 8px !important; height: 36px !important; padding: 0 12px !important; font-size: 14px !important; }
            .cl-formFieldInput::placeholder { color: #52525b !important; opacity: 1 !important; font-size: 13px !important; }
            .cl-formFieldInput:focus { border-color: #ffffff !important; box-shadow: 0 0 0 1px #ffffff !important; }
            .cl-footerActionText { color: #a1a1aa !important; }
            .cl-footerActionLink { color: #ffffff !important; font-weight: 500 !important; transition: color 0.2s ease !important; }
            .cl-formButtonPrimary { background-color: #ffffff !important; color: #000000 !important; border-radius: 8px !important; height: 36px !important; font-weight: 500 !important; transition: background-color 0.2s ease !important; }
            .cl-formButtonPrimary:hover { background-color: #e4e4e7 !important; opacity: 1 !important; }
            .cl-identityPreviewText { color: #ffffff !important; }
            .cl-identityPreviewEditButton { color: #a1a1aa !important; }
            .cl-header { gap: 8px !important; margin-bottom: 24px !important; }
            
            /* Extremely aggressive hiding of Clerk Dev Mode and Secured By badges */
            .cl-internal-1x6p197, 
            .cl-internal-1hp5n27, 
            .cl-internal-b3al4t, 
            .cl-internal-180wb59,
            .cl-internal-17y6xzt,
            .cl-internal-txa32q { display: none !important; opacity: 0 !important; visibility: hidden !important; } 
            
            /* Hide the container that usually holds the Secured by Clerk / Dev Mode text 
               (Removed structural CSS to prevent Clerk console warnings) */
            div[style*="position: fixed"][style*="bottom"] { display: none !important; }
            a[href^="https://clerk.com"] { display: none !important; }
          `}} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
