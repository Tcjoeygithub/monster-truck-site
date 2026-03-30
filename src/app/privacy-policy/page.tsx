import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Free Monster Truck Coloring Pages. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://freemonstertruckcoloringpages.com";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <h1 className="font-[var(--font-display)] text-3xl font-bold text-brand-black mb-6">
        Privacy Policy
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Last updated: March 30, 2026
      </p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Introduction
          </h2>
          <p>
            Free Monster Truck Coloring Pages (&ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at{" "}
            <strong>{siteUrl}</strong> (the &ldquo;Site&rdquo;). This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our Site. Please read this policy
            carefully. By using the Site, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Information We Collect
          </h2>
          <h3 className="text-lg font-semibold text-brand-black mt-4 mb-2">
            Automatically Collected Information
          </h3>
          <p>
            When you visit our Site, we may automatically collect certain
            information about your device, including information about your web
            browser, IP address, time zone, and some of the cookies that are
            installed on your device. Additionally, as you browse the Site, we
            collect information about the individual web pages you view, what
            websites or search terms referred you to the Site, and information
            about how you interact with the Site. We refer to this
            automatically-collected information as &ldquo;Device
            Information.&rdquo;
          </p>
          <p className="mt-3">
            We collect Device Information using the following technologies:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Cookies</strong> &ndash; data files placed on your device.
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent.
            </li>
            <li>
              <strong>Log files</strong> &ndash; track actions occurring on the
              Site and collect data including your IP address, browser type,
              Internet service provider, referring/exit pages, and date/time
              stamps.
            </li>
            <li>
              <strong>Web beacons, tags, and pixels</strong> &ndash; electronic
              files used to record information about how you browse the Site.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-brand-black mt-4 mb-2">
            Voluntarily Provided Information
          </h3>
          <p>
            If you choose to subscribe to our email or SMS notifications, we
            collect your name, email address, and optionally your phone number.
            This information is sent to our third-party marketing platform
            (GoHighLevel) for the sole purpose of sending you updates about new
            coloring pages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide, operate, and maintain our Site</li>
            <li>Improve, personalize, and expand our Site</li>
            <li>Understand and analyze how you use our Site</li>
            <li>
              Send you emails or SMS messages about new coloring pages (only if
              you opted in)
            </li>
            <li>Serve relevant advertisements</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Advertising
          </h2>
          <p>
            We use Google AdSense to display advertisements on our Site. Google
            AdSense uses cookies and similar technologies to serve ads based on
            your prior visits to our Site or other websites. Google&rsquo;s use
            of advertising cookies enables it and its partners to serve ads
            based on your visit to our Site and/or other sites on the Internet.
          </p>
          <p className="mt-3">
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="text-brand-orange hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of a third-party vendor&rsquo;s use
            of cookies for personalized advertising by visiting{" "}
            <a
              href="https://www.aboutads.info/choices/"
              className="text-brand-orange hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aboutads.info
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Google Analytics
          </h2>
          <p>
            We use Google Analytics to monitor and analyze web traffic and to
            keep track of user behavior on our Site. Google Analytics is a web
            analytics service offered by Google that tracks and reports website
            traffic. Google uses the data collected to track and monitor the use
            of our Site. This data is shared with other Google services. For more
            information on the privacy practices of Google, please visit the{" "}
            <a
              href="https://policies.google.com/privacy"
              className="text-brand-orange hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy &amp; Terms page
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Children&rsquo;s Privacy (COPPA Compliance)
          </h2>
          <p>
            Our Site is designed to provide coloring pages for children, but it
            is intended to be used by parents and guardians on behalf of their
            children. We do not knowingly collect personal information from
            children under the age of 13. If you are a parent or guardian and
            believe your child has provided us with personal information, please
            contact us and we will delete that information.
          </p>
          <p className="mt-3">
            We do not require children to provide any personal information to
            access or use the coloring pages on our Site. Coloring pages can be
            printed and downloaded without creating an account or providing any
            personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Third-Party Services
          </h2>
          <p>
            Our Site may contain links to third-party websites and services that
            are not operated by us. We have no control over and assume no
            responsibility for the content, privacy policies, or practices of
            any third-party sites or services. We use the following third-party
            services:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Google AdSense</strong> &ndash; for displaying
              advertisements
            </li>
            <li>
              <strong>Google Analytics</strong> &ndash; for website analytics
            </li>
            <li>
              <strong>Google Tag Manager</strong> &ndash; for managing tracking
              scripts
            </li>
            <li>
              <strong>GoHighLevel</strong> &ndash; for email and SMS
              notification delivery
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete any personal
            information we hold about you. You may also unsubscribe from our
            email or SMS notifications at any time using the unsubscribe link in
            our messages or by contacting us directly.
          </p>
          <p className="mt-3">
            If you are a resident of the European Economic Area (EEA), you have
            certain data protection rights under the GDPR. If you are a
            California resident, you have rights under the CCPA. Please contact
            us to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &ldquo;Last updated&rdquo; date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at our{" "}
            <a
              href="/contact"
              className="text-brand-orange hover:underline"
            >
              Contact Page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
