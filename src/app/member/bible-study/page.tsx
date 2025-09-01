'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { safeFetch } from '@/lib/api';

// Define types for our data to ensure type safety
interface Course {
  id: string;
  title: string;
  description: string;
}

interface Enrollment {
  course: Course;
  progressPercentage: number;
}

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const CourseCard = ({ course, progress }: { course: Course; progress?: number }) => (
  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
      <CardDescription className="line-clamp-3 h-12">{course.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col justify-end">
      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-600">Progress</span>
            <span className="text-xs font-bold text-blue-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      <Link href={`/member/bible-study/${course.id}`} passHref>
        <Button className="w-full mt-auto">
          {progress !== undefined ? 'Continue Study' : 'Start Course'} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const BibleStudyDashboard = () => {
  const { data: session, status } = useSession();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [enrollmentData, coursesData] = await Promise.all([
            safeFetch(`/api/users/${session.user.id}/bible-study-enrollments`),
            safeFetch('/api/bible-study'),
          ]);
          setEnrollments(enrollmentData || []);
          setAllCourses(coursesData || []);
        } catch (error) {
          console.error("Failed to fetch bible study data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [status, session]);

  const inProgressCourses = enrollments.filter(e => e.progressPercentage < 100);
  const completedCoursesCount = enrollments.filter(e => e.progressPercentage === 100).length;
  
  const enrolledCourseIds = new Set(enrollments.map(e => e.course.id));
  const availableCourses = allCourses.filter(c => !enrolledCourseIds.has(c));

  if (isLoading || status === 'loading') {
    return (
      <div className="p-4 sm:p-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bible Study Dashboard</h1>
        <p className="text-muted-foreground">Your journey of faith and learning.</p>
      </header>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard title="In Progress" value={inProgressCourses.length} icon={Zap} />
        <StatCard title="Completed" value={completedCoursesCount} icon={CheckCircle} />
        <StatCard title="Available Courses" value={availableCourses.length} icon={BookOpen} />
      </div>

      {/* My Courses Section */}
      {inProgressCourses.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inProgressCourses.map(enrollment => (
              <CourseCard key={enrollment.course.id} course={enrollment.course} progress={enrollment.progressPercentage} />
            ))}
          </div>
        </section>
      )}

      {/* Available Courses Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Course Library</h2>
        {availableCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No new courses available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
};

export default BibleStudyDashboard;