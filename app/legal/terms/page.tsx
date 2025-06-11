import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - The Sharp Executive',
  description: 'Terms and conditions governing the use of our services.',
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: June 9, 2025</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to The Sharp Executive. These Terms of Service ("Terms") govern your access to and use of our website and services. 
            Please read these Terms carefully before using our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>"Service"</strong> refers to the website and any related services provided by The Sharp Executive.</li>
            <li><strong>"User"</strong> refers to anyone who accesses or uses our Service.</li>
            <li><strong>"Content"</strong> refers to text, images, videos, and other materials available on our Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Use of Service</h2>
          <p className="text-muted-foreground mb-4">By using our Service, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Comply with all applicable laws and regulations</li>
            <li>Not engage in any activity that interferes with or disrupts the Service</li>
            <li>Not attempt to gain unauthorized access to our systems or networks</li>
            <li>Not use the Service for any illegal or unauthorized purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations, 
            is the property of The Sharp Executive or its content suppliers and protected by international copyright laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            In no event shall The Sharp Executive, nor its directors, employees, partners, agents, suppliers, or affiliates, 
            be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms at any time. We will provide notice of any changes by posting the new Terms on this page 
            and updating the "Last updated" date at the top of these Terms. Your continued use of the Service after any such changes constitutes 
            your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2 text-muted-foreground">
            Email: legal@thesharpexecutive.com<br />
            Address: [Your Company Address]
          </p>
        </section>
      </div>
    </div>
  );
}
