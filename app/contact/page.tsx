import { Metadata } from 'next';
import { Mail, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - The Sharp Executive',
  description: 'Get in touch with The Sharp Executive team for inquiries and support.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Get In Touch</h1>
        <p className="text-muted-foreground text-lg">
          We'd love to hear from you. Reach out to us with any questions or inquiries.
        </p>
      </div>

      <div className="bg-muted/30 rounded-lg p-8 max-w-2xl mx-auto">
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Email Us</h2>
            <p className="text-muted-foreground mb-4">
              Send us an email and we'll get back to you as soon as possible.
            </p>
            <a 
              href="mailto:corey@thesharpexecutive.com" 
              className="text-blue-600 hover:underline font-medium"
            >
              corey@thesharpexecutive.com
            </a>
          </div>

          <div className="h-px bg-border w-full" />

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Response Time</span>
            </div>
            <p className="text-muted-foreground">
              We typically respond to all inquiries within 24-48 hours during business days.
            </p>
          </div>

          <div className="h-px bg-border w-full" />

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Looking for something else?</span>
            </div>
            <p className="text-muted-foreground">
              Check out our <a href="/about" className="text-blue-600 hover:underline">About</a> page to learn more about our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
