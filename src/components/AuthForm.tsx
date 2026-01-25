"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import Link from "next/link";
import { churchConfig } from "@/lib/church-config";
import * as Tabs from "@radix-ui/react-tabs";
import { SocialLogin } from "./SocialLogin";

import Image from "next/image";

const AuthForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-xl rounded-2xl border border-gray-200">
          <div className="flex justify-center pt-6">
            <Image
              src="/images/zion-hill.png"
              alt="Church Logo"
              width={120}
              height={120}
            />
          </div>
          <Tabs.Root defaultValue="login">
            <CardHeader className="pb-4">
              <Tabs.List className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <Tabs.Trigger
                  value="login"
                  className="px-4 py-2 text-sm font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 text-gray-500"
                >
                  Login
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="signup"
                  className="px-4 py-2 text-sm font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 text-gray-500"
                >
                  Sign Up
                </Tabs.Trigger>
              </Tabs.List>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <Tabs.Content value="login">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                    Login to your Account
                  </CardTitle>
                  <LoginForm />
                </motion.div>
              </Tabs.Content>
              <Tabs.Content value="signup">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                    Create Your Account
                  </CardTitle>
                  <SignupForm />
                </motion.div>
              </Tabs.Content>
              <p className="mt-4 text-center text-sm text-gray-600">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </p>
            </CardContent>
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <SocialLogin />
            </div>
          </Tabs.Root>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthForm;
