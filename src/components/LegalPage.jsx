import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

const PrivacyContent = () => (
  <>
    <h1>Privacy Policy</h1>
    <p className="legal-updated">Last Updated: September 13, 2026</p>
    <p><strong>NEXT STOP</strong> ("we," "us," "our") operates the NEXT STOP travel planning platform (the "Service"). This Privacy Policy explains how we collect, use, store, and protect your personal information.</p>

    <h2>1. Information We Collect</h2>

    <h3>1.1 Information You Provide</h3>
    <p>When you create an account or use our Service, we collect:</p>
    <table>
      <thead><tr><th>Data</th><th>Purpose</th><th>Required</th></tr></thead>
      <tbody>
        <tr><td>Email address</td><td>Account creation, login, verification</td><td>Yes</td></tr>
        <tr><td>Name / Username</td><td>Display name across the platform</td><td>Yes</td></tr>
        <tr><td>Password</td><td>Authentication (stored as bcrypt hash)</td><td>Yes</td></tr>
        <tr><td>Date of Birth</td><td>Age verification, personalized recommendations</td><td>Yes</td></tr>
        <tr><td>Gender</td><td>Travel safety tips, personalized suggestions</td><td>Optional</td></tr>
        <tr><td>Bio</td><td>Public profile display</td><td>Optional</td></tr>
        <tr><td>Profile picture</td><td>Public profile display</td><td>Optional</td></tr>
        <tr><td>Interest tags</td><td>Personalized travel recommendations</td><td>Optional</td></tr>
      </tbody>
    </table>

    <h3>1.2 Information We Collect Automatically</h3>
    <ul>
      <li><strong>Search queries</strong> — destinations, travel dates, and preferences (cached to improve performance)</li>
      <li><strong>Device information</strong> — browser type, screen size (for responsive design only)</li>
      <li><strong>Usage data</strong> — pages visited, features used (for improving the Service)</li>
    </ul>

    <h3>1.3 Information We Do NOT Collect</h3>
    <ul>
      <li>We do <strong>not</strong> track your real-time GPS location</li>
      <li>We do <strong>not</strong> sell or share your data with advertisers</li>
      <li>We do <strong>not</strong> store your payment information</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li><strong>Provide the Service</strong> — generate AI trip plans, show search results, personalize recommendations</li>
      <li><strong>Authenticate you</strong> — verify identity via email and maintain login sessions</li>
      <li><strong>Improve the Service</strong> — analyze usage patterns to fix bugs and build better features</li>
      <li><strong>Communicate</strong> — send verification emails and important service updates (no marketing spam)</li>
    </ul>

    <h2>3. Data Storage & Security</h2>

    <h3>3.1 Where Your Data Is Stored</h3>
    <p>Your account data is stored securely in <strong>Supabase</strong> (hosted on cloud infrastructure). Cached search results are stored with automatic expiration.</p>

    <h3>3.2 How We Protect Your Data</h3>
    <ul>
      <li><strong>Passwords</strong> are hashed using bcrypt — we never store your raw password</li>
      <li><strong>Sessions</strong> use JWT tokens with automatic expiration</li>
      <li><strong>Row Level Security</strong> is enabled on all database tables</li>
      <li><strong>HTTPS</strong> encryption for all data in transit</li>
    </ul>

    <h3>3.3 Data Retention</h3>
    <ul>
      <li>Account data is retained as long as your account is active</li>
      <li>Cached search data expires automatically (10 minutes to 90 days)</li>
      <li>You can request deletion of your account and all data at any time</li>
    </ul>

    <h2>4. Third-Party Services</h2>
    <table>
      <thead><tr><th>Service</th><th>Purpose</th><th>Data Shared</th></tr></thead>
      <tbody>
        <tr><td>Supabase</td><td>Authentication, database</td><td>Email, name, password hash</td></tr>
        <tr><td>Google Gemini AI</td><td>Trip plan generation</td><td>Search queries only — no personal data</td></tr>
        <tr><td>RapidAPI providers</td><td>Flight, train, bus, hotel search</td><td>Search queries only — no personal data</td></tr>
        <tr><td>Unsplash</td><td>Destination images</td><td>None</td></tr>
      </tbody>
    </table>
    <p>We do <strong>not</strong> share your personal information with any third-party API.</p>

    <h2>5. Your Rights</h2>
    <ul>
      <li><strong>Access</strong> your personal data</li>
      <li><strong>Update</strong> your profile at any time</li>
      <li><strong>Delete</strong> your account and all associated data</li>
      <li><strong>Export</strong> your personal data</li>
    </ul>
    <p>To exercise any of these rights, contact us at the email listed below.</p>

    <h2>6. Children's Privacy</h2>
    <p>Our Service is not intended for children under <strong>13</strong>. We do not knowingly collect personal information from children under 13.</p>

    <h2>7. Future Features</h2>
    <table>
      <thead><tr><th>Feature</th><th>Additional Data</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td>Phone number login</td><td>Phone number</td><td>Alternative authentication</td></tr>
        <tr><td>Wanderlog posts</td><td>Text, photos, location tags</td><td>User-generated travel content</td></tr>
        <tr><td>Wanderlog saves</td><td>Saved post IDs</td><td>Bookmarking favorite content</td></tr>
      </tbody>
    </table>
    <p>This Privacy Policy will be updated before these features launch.</p>

    <h2>8. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify you by posting the updated policy on this page and updating the "Last Updated" date.</p>

    <h2>9. Contact Us</h2>
    <p>If you have questions about this Privacy Policy, contact us at:</p>
    <p><strong>Email:</strong> t.adhikari.feb.2006@gmail.com</p>
  </>
);

const TermsContent = () => (
  <>
    <h1>Terms and Conditions</h1>
    <p className="legal-updated">Last Updated: September 13, 2026</p>
    <p>Welcome to <strong>NEXT STOP</strong>. By accessing or using our travel planning platform (the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.</p>

    <h2>1. About the Service</h2>
    <p>NEXT STOP is a travel planning and discovery platform that helps users explore destinations across India. The Service provides AI-generated trip plans, flight/train/bus/hotel search results, destination information, and budget estimation tools.</p>
    <p className="legal-highlight">NEXT STOP is an information and planning tool — we are NOT a booking platform. We do not process bookings, payments, or reservations.</p>

    <h2>2. Account Registration</h2>
    <h3>2.1 Eligibility</h3>
    <p>You must be at least <strong>13 years old</strong> to create an account.</p>

    <h3>2.2 Account Security</h3>
    <ul>
      <li>You are responsible for maintaining the confidentiality of your password</li>
      <li>You must provide accurate and truthful information during registration</li>
      <li>You must not create accounts using fake or disposable email addresses</li>
      <li>You are responsible for all activity under your account</li>
    </ul>

    <h3>2.3 Account Termination</h3>
    <p>We reserve the right to suspend or terminate your account if you violate these Terms, use the Service for unlawful purposes, abuse the platform, or create multiple accounts.</p>

    <h2>3. Acceptable Use</h2>
    <p>You agree <strong>NOT</strong> to:</p>
    <ul>
      <li>Use the Service for any illegal or unauthorized purpose</li>
      <li>Attempt to access other users' accounts or personal data</li>
      <li>Scrape, crawl, or use automated tools to extract data</li>
      <li>Upload malicious content, viruses, or harmful code</li>
      <li>Harass, abuse, or harm other users</li>
      <li>Impersonate any person or entity</li>
      <li>Reverse engineer any part of the Service</li>
    </ul>

    <h2>4. User Content</h2>
    <h3>4.1 Current Features</h3>
    <p>Currently, user content is limited to profile information (name, bio, profile picture, tags).</p>
    <h3>4.2 Future Features (Wanderlog)</h3>
    <p>When Wanderlog features launch: you retain ownership of your content; by posting, you grant NEXT STOP a non-exclusive license to display it within the Service; content must not be illegal, defamatory, or harmful; we reserve the right to remove violating content.</p>

    <h2>5. Intellectual Property</h2>
    <p>The Service, including its design, code, and branding, is owned by NEXT STOP. Travel data is sourced from third-party APIs. AI-generated plans are for personal, non-commercial use.</p>

    <h2>6. Disclaimers</h2>
    <h3>6.1 Information Accuracy</h3>
    <p>Travel information (prices, schedules, availability) is sourced from third-party APIs and <strong>may not be accurate or up-to-date</strong>. AI-generated itineraries are suggestions only. Always verify critical travel details with official sources.</p>

    <h3>6.2 Service Availability</h3>
    <p>The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong>. We do not guarantee uninterrupted or error-free operation.</p>

    <h3>6.3 No Booking Guarantee</h3>
    <p>NEXT STOP does <strong>not</strong> guarantee availability of any flights, trains, buses, hotels, or experiences shown on the platform.</p>

    <h2>7. Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, NEXT STOP shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. We are not liable for losses resulting from travel decisions made using information from the Service.</p>

    <h2>8. Privacy</h2>
    <p>Your use of the Service is also governed by our <Link to="/privacy">Privacy Policy</Link>.</p>

    <h2>9. Third-Party Links</h2>
    <p>The Service may contain links to third-party websites. We are not responsible for their content, privacy practices, or availability.</p>

    <h2>10. Changes to These Terms</h2>
    <p>We may update these Terms from time to time. Continued use after changes constitutes acceptance.</p>

    <h2>11. Governing Law</h2>
    <p>These Terms are governed by the laws of <strong>India</strong>. Disputes shall be subject to the exclusive jurisdiction of courts in India.</p>

    <h2>12. Contact Us</h2>
    <p>If you have questions about these Terms, contact us at:</p>
    <p><strong>Email:</strong> t.adhikari.feb.2006@gmail.com</p>
  </>
);

const LegalPage = ({ type = 'privacy' }) => {
  return (
    <div className="legal-page">
      <nav className="legal-nav">
        <Link to="/" className="legal-logo">NEXT STOP</Link>
        <div className="legal-nav-links">
          <Link to="/privacy" className={`legal-nav-link ${type === 'privacy' ? 'active' : ''}`}>Privacy Policy</Link>
          <Link to="/terms" className={`legal-nav-link ${type === 'terms' ? 'active' : ''}`}>Terms & Conditions</Link>
        </div>
      </nav>
      <article className="legal-content">
        {type === 'privacy' ? <PrivacyContent /> : <TermsContent />}
      </article>
      <footer className="legal-footer">
        <p>© {new Date().getFullYear()} NEXT STOP. All rights reserved.</p>
        <div className="legal-footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/">Home</Link>
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;
