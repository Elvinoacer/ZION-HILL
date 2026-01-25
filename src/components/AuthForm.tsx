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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-gray-50 to-white opacity-70"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-4"
      >
        <Card className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
          <div className="flex flex-col items-center pt-8 pb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
              <Image
                src="/images/zion-hill.png"
                alt="Church Logo"
                width={100}
                height={100}
                className="relative z-10 drop-shadow-md"
              />
            </div>
            <h2 className="mt-4 text-gray-800 font-bold text-lg tracking-tight">Zion Hill</h2>
          </div>
          
          <Tabs.Root defaultValue="login" className="w-full">
            <CardHeader className="pb-0 px-8">
              <Tabs.List className="grid w-full grid-cols-2 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50">
                <Tabs.Trigger
                  value="login"
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 text-gray-500 hover:text-gray-700"
                >
                  Login
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="signup"
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 text-gray-500 hover:text-gray-700"
                >
                  Sign Up
                </Tabs.Trigger>
              </Tabs.List>
            </CardHeader>
            
            <CardContent className="p-8 pt-6">
              <Tabs.Content value="login" className="focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Welcome Back
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                  </div>
                  <LoginForm />
                </motion.div>
              </Tabs.Content>
              
              <Tabs.Content value="signup" className="focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Join Our Community
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Create your account today</p>
                  </div>
                  <SignupForm />
                </motion.div>
              </Tabs.Content>

              <div className="mt-6 pt-4 border-t border-gray-100">
                 <SocialLogin />
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-500 hover:text-blue-600 hover:underline transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Tabs.Root>
        </Card>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Zion Hill Church. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
