import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold mt-6 mb-4">Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to Grace Community Church. We are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may collect personal information from you in a variety of ways, including, but
              not limited to, when you visit our site, register on the site, subscribe to the
              newsletter, and in connection with other activities, services, features or
              resources we make available on our Site.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may use the information we collect in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 text-gray-700 dark:text-gray-300">
              <li>To personalize your experience.</li>
              <li>To improve our website.</li>
              <li>To send periodic emails.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              info@gracecommunity.org
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
