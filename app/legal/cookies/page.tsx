import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - The Sharp Executive',
  description: 'Learn about how we use cookies and similar technologies on our website.',
};

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: June 9, 2025</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p className="text-muted-foreground">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and to provide information to the website owners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p className="text-muted-foreground mb-4">We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off.</li>
            <li><strong>Performance Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
            <li><strong>Functional Cookies:</strong> These enable the website to provide enhanced functionality and personalization.</li>
            <li><strong>Targeting Cookies:</strong> These may be set through our site by our advertising partners to build a profile of your interests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Managing Cookies</h2>
          <p className="text-muted-foreground">
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. 
            However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
          <p className="text-muted-foreground">
            We may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. 
            These cookies may be used when you share information using a social media sharing button on our site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Changes to This Cookie Policy</h2>
          <p className="text-muted-foreground">
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Cookie Policy, you can contact us at:
          </p>
          <p className="mt-2 text-muted-foreground">
            Email: privacy@thesharpexecutive.com<br />
            Address: [Your Company Address]
          </p>
        </section>
      </div>
    </div>
  );
}
