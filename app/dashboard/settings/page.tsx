'use client'

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard, User, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.clear();
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error signing out");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      {/* Account Information */}
      <Card className="p-6 bg-[#1c1c1c] border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <User className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-white">Account Information</h2>
        </div>
        <div className="space-y-4 text-gray-300">
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p>{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">User ID</p>
            <p className="font-mono text-sm">{user?.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Full Name</p>
            <p>{user?.fullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Created</p>
            <p>{user?.createdAt?.toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Subscription Plan */}
      <Card className="p-6 bg-[#1c1c1c] border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <CreditCard className="h-6 w-6 text-violet-500" />
          <h2 className="text-xl font-semibold text-white">Current Plan</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Free Plan</p>
              <p className="text-sm text-gray-400">Basic features included</p>
            </div>
            <Button 
              variant="outline" 
              className="border-violet-500 text-violet-500 hover:bg-violet-500/10"
              onClick={() => router.push('/pricing')}
            >
              Upgrade Plan
            </Button>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400">Plan Features:</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-300">
              <li>• Basic workout tracking</li>
              <li>• Standard analytics</li>
              <li>• Community access</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Sign Out */}
      <Card className="p-6 bg-[#1c1c1c] border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LogOut className="h-6 w-6 text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-white">Sign Out</h2>
              <p className="text-sm text-gray-400">Sign out of your account</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
} 