'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const DeniedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center p-6 sm:p-8 md:p-10 bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full border-t-4 border-red-500"
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="mx-auto mb-5 sm:mb-6 bg-red-100 h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center"
        >
          <ShieldAlert className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
        </motion.div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">Access Denied</h1>
        
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          You do not have the necessary permissions to view this page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/" passHref>
                <Button variant="outline" className="w-full text-sm sm:text-base py-2.5 sm:py-3">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Homepage
                </Button>
            </Link>
            <Link href="/login" passHref>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-sm sm:text-base py-2.5 sm:py-3">
                    Login with a different account
                </Button>
            </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6 sm:mt-8">
            If you believe this is an error, please contact support.
        </p>
      </motion.div>
    </div>
  );
};

export default DeniedPage;
