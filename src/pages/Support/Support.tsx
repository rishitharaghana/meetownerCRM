import React, { useState } from 'react';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumbList from '../../components/common/PageBreadCrumbLists';

const faqs = [
  { question: "How do I reset my password?", answer: "Go to the login page and click 'Forgot Password' to reset it via email." },
  { question: "What are the support hours?", answer: "Support is available Monday to Friday, 9 AM to 6 PM IST." },
  { question: "How can I contact sales?", answer: "Reach out to sales@yourdomain.com or call +91-9876543210." },
];

const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [currentDate] = useState(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support request submitted:', { name, email, message });
    alert('Thank you for your message! We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen p-4">
     
      <ComponentCard title="Get Support">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our team is here to assist you. Last updated: {currentDate}.
            </p>
            <p className="text-gray-600 text-sm">
              Email: <a href="mailto:support@meetowner.in" className="text-blue-600 hover:underline">support@meetowner.in</a> | Phone: +91-9876543210
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Submit a Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="supportName">Name</Label>
                <Input
                  type="text"
                  id="supportName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="dark:bg-dark-900"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="supportEmail">Email</Label>
                <Input
                  type="email"
                  id="supportEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:bg-dark-900"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="supportMessage">Message</Label>
                <Input
                  type="text"
                  id="supportMessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="dark:bg-dark-900"
                  placeholder="Describe your issue"
                />
              </div>
              <Button variant="primary" size="md" type="submit">Submit Request</Button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-2">
                  <h4 className="text-md font-medium text-gray-800 dark:text-white/90">{faq.question}</h4>
                  <p className="text-gray-600 text-sm mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default Support;