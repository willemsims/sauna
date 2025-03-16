import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: ${new Date().toISOString().split('T')[0]}

Welcome to ${config.appName}!

These Terms of Service ("Terms") govern your use of the ${config.appName} website ("Website") and the services provided. By using our Website and services, you agree to these Terms.

1. Description of Service

${config.appName} is a directory platform that helps users discover and learn about saunas in various locations. We provide information about sauna facilities, their features, locations, and other relevant details.

2. User Accounts

You may browse our directory without creating an account. However, certain features may require account registration. If you create an account, you are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.

3. User Content

If our platform allows users to submit reviews, comments, or other content, you retain ownership of your content but grant us a non-exclusive, royalty-free license to use, display, and distribute your content in connection with our services.

4. Accuracy of Information

While we strive to provide accurate and up-to-date information about sauna facilities, we cannot guarantee the accuracy, completeness, or reliability of any information on our platform. Sauna businesses are responsible for maintaining their own listing information.

5. User Data and Privacy

We collect and store user data as necessary to provide our services. For details on how we handle your data, please refer to our Privacy Policy.

6. Non-Personal Data Collection

We use web cookies to collect non-personal data for the purpose of improving our services and user experience.

7. Limitation of Liability

${config.appName} is not responsible for the actions, content, information, or data of third parties. We are not liable for any damages or losses resulting from your use of our services or any listed sauna facilities.

8. Updates to the Terms

We may update these Terms from time to time. Users will be notified of any significant changes via the website or email if applicable.

Thank you for using ${config.appName}!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
