"use client";

import { useState } from 'react';
import { Card } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Loader2, User, Mail, Phone, LucideIcon } from 'lucide-react';
import { toast } from "sonner"; // Make sure to install: npm install sonner

interface User {
  name: string | null;
  email: string | null;
  number: string;
}

interface ProfileSettingsProps {
  user: User;
}

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  disabled?: boolean;
}

interface StatusProps {
  error: string | null;
  success: boolean;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    number: user.number
  });

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      // Show toast before reload
      toast.success("Changes Will Be Applied in Next Login", {
        duration: 3000,
      });
      
      // Add slight delay before reload
      setTimeout(() => {
        window.location.reload();
        reloadSession();
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      console.error('Update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField: React.FC<InputFieldProps> = ({ 
    id, 
    label, 
    type = "text", 
    value, 
    onChange, 
    icon: Icon, 
    disabled = false 
  }) => (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full pl-10 pr-4 py-2.5 rounded-lg
            border border-gray-200 dark:border-gray-800 
            ${disabled 
              ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400' 
              : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
            }
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition duration-200 ease-in-out
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          `}
        />
      </div>
    </div>
  );

  const Status: React.FC<StatusProps> = ({ error, success }) => {
    if (error) {
      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-fadeIn">
          {error}
        </div>
      );
    }
    if (success) {
      return (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 animate-fadeIn">
          Profile updated successfully
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="max-w-xl mx-auto" title={''}>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Profile Settings
          </h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <InputField
            id="name"
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            icon={User}
          />

          <InputField
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            icon={Mail}
          />

          <InputField
            id="number"
            label="Phone Number"
            value={formData.number}
            onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            icon={Phone}
            disabled
          />

          <Status error={error} success={success} />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-base font-medium transition-all duration-200 ease-in-out"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating Profile...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}