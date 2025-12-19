
import React from 'react';
import { Shield, Lock, Zap, Globe, Server, CheckCircle } from 'lucide-react';

export const Privacy: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
    <div className="border-b border-gray-200 pb-8 mb-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
      <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
    </div>

    <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Information</h2>
        <p>
          At FileMaker, accessible from https://filemaker.com, one of our main priorities is the privacy of our visitors. 
          This Privacy Policy document contains types of information that is collected and recorded by FileMaker and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </p>
      </section>

      <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="text-chrome-blue" />
          2. Client-Side Processing (Zero-Upload Policy)
        </h2>
        <p className="font-medium text-gray-800 mb-2">
          We take a unique approach to data handling to ensure maximum security.
        </p>
        <p>
          Unlike traditional conversion websites, FileMaker operates primarily using <strong>Client-Side Technology</strong>. 
          This means that when you use our Image Converter, Resizer, or PDF tools, your files are processed directly within your web browser. 
          <strong>Your images are never uploaded to our servers.</strong> They remain on your device at all times, ensuring 100% data privacy and security.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Log Files</h2>
        <p>
          FileMaker follows a standard procedure of using log files. These files log visitors when they visit websites. 
          All hosting companies do this as a part of hosting services' analytics. The information collected by log files includes 
          internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, 
          and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Web Beacons</h2>
        <p>
          Like any other website, FileMaker uses 'cookies'. These cookies are used to store information including visitors' preferences, 
          and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience 
          by customizing our web page content based on visitors' browser type and/or other information.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Google DoubleClick DART Cookie</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors 
          based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of 
          DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – 
          <a href="https://policies.google.com/technologies/ads" className="text-chrome-blue hover:underline ml-1" target="_blank" rel="noreferrer">
            https://policies.google.com/technologies/ads
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Security & SSL</h2>
        <p>
          We employ industry-standard Secure Socket Layer (SSL) encryption to ensure that your connection to our website is secure. 
          You can verify this by looking for the padlock icon in your browser's address bar. This ensures that any data transmitted 
          between your browser and the website content delivery network is encrypted.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
        <p>Under the CCPA, among other rights, California consumers have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
          <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
          <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. GDPR Data Protection Rights</h2>
        <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>The right to access – You have the right to request copies of your personal data.</li>
          <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
          <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
        </ul>
      </section>
    </div>
  </div>
);

export const About: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-12">
    {/* Hero Section */}
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About FileMaker</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        We are a passionate team of developers dedicated to making the web faster, safer, and more accessible. 
        FileMaker provides professional-grade image tools completely free of charge.
      </p>
    </div>

    {/* Mission Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-blue-100 text-chrome-blue rounded-xl flex items-center justify-center mb-4">
          <Zap size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
        <p className="text-gray-600">
          Our advanced algorithms run directly in your browser. No queueing, no uploading, no waiting. Instant results every time.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
          <Lock size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Secure by Design</h3>
        <p className="text-gray-600">
          We use SSL (HTTPS) encryption and client-side processing. Your files never leave your computer, ensuring absolute privacy.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
          <Globe size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">100% Free</h3>
        <p className="text-gray-600">
          We believe powerful tools should be accessible to everyone. No subscriptions, no hidden fees, just great software.
        </p>
      </div>
    </div>

    {/* Story Section */}
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Our Story & Technology</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2024, FileMaker was created to solve a common frustration: simple image tasks shouldn't require complex software or unsafe websites.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We utilize <strong>WebAssembly</strong> and modern HTML5 Canvas technologies to bring desktop-class performance to the web. 
            This "Green Tech" approach not only secures your data but also reduces the carbon footprint associated with server-side processing.
          </p>
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-800 pt-4">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> SSL Certified</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> GDPR Compliant</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> 24/7 Availability</span>
          </div>
        </div>
        <div className="flex-shrink-0 relative">
           <div className="w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full opacity-10 absolute -top-4 -right-4"></div>
           <Server size={200} className="text-gray-200 relative z-10" />
        </div>
      </div>
    </div>
  </div>
);

export const Contact: React.FC = () => (
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-gray-600">
        Have questions about our tools, need support, or want to report a bug? We're here to help.
      </p>
    </div>
    
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-chrome-blue focus:ring-chrome-blue p-3 border" placeholder="John" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-chrome-blue focus:ring-chrome-blue p-3 border" placeholder="Doe" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input type="email" className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-chrome-blue focus:ring-chrome-blue p-3 border" placeholder="john@example.com" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <select className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-chrome-blue focus:ring-chrome-blue p-3 border">
          <option>General Inquiry</option>
          <option>Report a Bug</option>
          <option>Feature Request</option>
          <option>Advertising</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea rows={5} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-chrome-blue focus:ring-chrome-blue p-3 border" placeholder="How can we help you?"></textarea>
      </div>

      <button className="w-full bg-chrome-blue text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
        Send Message
      </button>
    </form>

    <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
      <p>Alternatively, you can email us directly at: <a href="mailto:support@filemaker.com" className="text-chrome-blue hover:underline">support@filemaker.com</a></p>
    </div>
  </div>
);

export const Terms: React.FC = () => (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
    <div className="border-b border-gray-200 pb-8 mb-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
      <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
    </div>

    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using FileMaker, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-2">2. Use of License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on FileMaker's website for personal, non-commercial transitory viewing only.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-2">3. Disclaimer</h2>
        <p>
          The materials on FileMaker's website are provided on an 'as is' basis. FileMaker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </section>
      
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Limitations</h2>
        <p>
          In no event shall FileMaker or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FileMaker's website.
        </p>
      </section>
    </div>
  </div>
);
