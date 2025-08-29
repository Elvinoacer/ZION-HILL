import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

const sitemapLinks = {
    'Main': [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/donations', label: 'Donations' },
    ],
    'Ministries': [
        { href: '/ministries', label: 'All Ministries' },
    ],
    'Resources': [
        { href: '/blog', label: 'Blog' },
        { href: '/media', label: 'Media' },
        { href: '/livestream-integration', label: 'Livestream' },
    ],
    'Legal': [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
    ]
}

const SitemapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Sitemap</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(sitemapLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">{category}</h3>
                  <ul className="space-y-3 mt-4">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors flex items-center group">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SitemapPage;
