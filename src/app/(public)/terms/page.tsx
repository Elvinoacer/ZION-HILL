import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold mt-6 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By using our website, you agree to be bound by these Terms of Service. If you do not
              agree to these Terms, please do not use our website.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">Use of the Website</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree to use the website for lawful purposes only. You may not use the website
              in any way that could damage the website, the services, or the general business of
              Grace Community Church.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All content on this website, including text, graphics, logos, and images, is the
              property of Grace Community Church or its content suppliers and is protected by
              international copyright laws.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
              info@gracecommunity.org
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
