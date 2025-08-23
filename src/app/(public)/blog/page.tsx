'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Tag, Calendar, Clock, ArrowRight, Loader, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  tags: string[];
  createdAt: string;
  readTime?: number;
  coverImage?: string;
}

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await safeFetch<BlogPost[]>("/api/blog");
        setBlogPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter(post => 
        selectedTag ? post.tags.includes(selectedTag) : true
      )
      .filter(post => 
        searchQuery ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );
  }, [blogPosts, selectedTag, searchQuery]);

  const allTags = useMemo(() => Array.from(new Set(blogPosts.flatMap(post => post.tags))), [blogPosts]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Filters 
          tags={allTags} 
          selectedTag={selectedTag} 
          setSelectedTag={setSelectedTag} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <AnimatePresence>
          {filteredPosts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            >
              {filteredPosts.map(post => <BlogPostCard key={post.id} post={post} />)}
            </motion.div>
          ) : (
            <NoPostsFound onClear={() => { setSelectedTag(null); setSearchQuery(''); }} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Header = () => (
  <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-12 md:py-20 lg:py-24"
  >
    <div className="container mx-auto px-4 sm:px-6">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">From the Pastor's Desk</h1>
      <p className="mt-3 md:mt-4 text-base md:text-lg text-blue-100 max-w-3xl mx-auto">Insights, stories, and reflections to inspire your walk with Christ.</p>
    </div>
  </motion.header>
);

const Filters = ({ tags, selectedTag, setSelectedTag, searchQuery, setSearchQuery }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200/80 -mt-16 sm:-mt-20 md:-mt-24 sticky top-4 z-10"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center">
      <div className="relative md:col-span-2">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <Input 
          placeholder="Search articles..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="pl-10 sm:pl-12 h-10 sm:h-12 text-base sm:text-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition"
        />
      </div>
      <Select value={selectedTag || ''} onValueChange={value => setSelectedTag(value || null)}>
        <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg"><SelectValue placeholder="Filter by tag" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>All Tags</SelectItem>
          {tags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  </motion.div>
);

const BlogPostCard = ({ post }: { post: BlogPost }) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} whileHover={{ y: -5 }} className="flex">
    <Card className="w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative h-40 sm:h-48 w-full">
        <Image src={post.coverImage || '/images/blog-default.png'} alt={post.title} layout="fill" objectFit="cover" className="rounded-t-2xl" />
      </div>
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
            {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <InfoItem icon={Calendar} text={new Date(post.createdAt).toLocaleDateString()} />
            {post.readTime && <InfoItem icon={Clock} text={`${post.readTime} min read`} />}
          </div>
          <Link href={`/blog/${post.id}`} passHref>
            <Button variant="ghost" className="w-full mt-3 sm:mt-4 justify-between group text-blue-600 hover:bg-blue-50">
              Read More <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const InfoItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-1.5">
    <Icon className="h-3.5 w-3.5" />
    <span>{text}</span>
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  return (
    <span className={`${baseStyle} ${variants[variant]}`}>
      {children}
    </span>
  );
};

const LoadingState = () => (
  <div className="container mx-auto px-4 sm:px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="rounded-2xl overflow-hidden animate-pulse shadow-md">
          <div className="h-40 sm:h-48 bg-gray-200"></div>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="text-center py-16 sm:py-24">
    <AlertCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-red-600">Failed to load posts</h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">{message}</p>
  </div>
);

const NoPostsFound = ({ onClear }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 sm:py-24 col-span-full">
    <BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-800">No Posts Found</h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">Try adjusting your search or filters.</p>
    <Button variant="ghost" onClick={onClear} className="mt-3 sm:mt-4">Clear Filters</Button>
  </motion.div>
);

export default BlogPage;
