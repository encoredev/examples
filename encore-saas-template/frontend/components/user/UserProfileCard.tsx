import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFirebase } from "@/app/lib/firebase/FirebaseProvider";
import { toast } from "sonner";
import { User, Mail, KeyRound } from "lucide-react";
import { useUser } from '@/app/lib/hooks';
import { useUpdateUserMutation } from '@/app/lib/hooks';

export function UserProfileCard() {
  const { user, token } = useFirebase();
  const { userData } = useUser(token);
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUserMutation(token);
  const [displayName, setDisplayName] = useState(userData?.display_name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordAgain, setCurrentPasswordAgain] = useState('');

  useEffect(() => {
    setDisplayName(userData?.display_name || '');
    setEmail(userData?.email || '');
  }, [userData]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    if (currentPassword && currentPasswordAgain && currentPassword !== currentPasswordAgain) {
      toast.error('Current password and new password do not match');
      return;
    }

    console.log('Email being sent to backend:', email);

    updateUser({
      userId: userData?.id || '',
      request: {
        display_name: displayName,
        profile_picture_url: userData?.profile_picture_url || '',
        stripe_customer_id: userData?.stripe_customer_id || '',
        email: email,
        password: currentPassword
      }
    });
  };

  return (
    <Card className="bg-white border-zinc-100">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-black">Profile Settings</h2>
        <p className="text-sm text-gray-500 mb-4">Leave fields blank to keep the same value.</p>
        <div className="space-y-6">
          {/* Display Name Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Display Name</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  console.log(e.target.value)
                  setEmail(e.target.value)
                }}
                className="pl-9"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Change Password</label>
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="password"
                  placeholder="Current password again"
                  value={currentPasswordAgain}
                  onChange={(e) => setCurrentPasswordAgain(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={(!currentPassword && !currentPasswordAgain && !displayName && !email) || isUpdatingUser}
                className="w-full bg-black text-white hover:bg-zinc-800 transition-colors"
              >
                {isUpdatingUser ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 