import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import ProfileForm from "../../components/ProfileForm";
import { authOptions } from "../lib/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = Number(session.user.id);

  if (!userId) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, number: true },
  });

  if (!user) {
    return (
      <div className="container max-w-6xl mx-auto px-4 pt-20 py-8">
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-gray-900 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
              Profile Not Found
            </h2>
            <p className="text-gray-700 dark:text-gray-200">
              Unable to load your profile information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col">
            <div className="mb-6 flex items-center">
              <Link
                href="/dashboard"
                className="group inline-flex items-center p-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 bg-white/50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <div className="bg-white/80 dark:bg-gray-900 backdrop-blur-xl rounded-2xl dark:border-gray-700">
              <ProfileForm user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}