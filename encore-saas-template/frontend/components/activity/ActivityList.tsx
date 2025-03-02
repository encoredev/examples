import { useEffect, useState } from 'react';
import Client, { activity, user } from '@/app/lib/client';
import { useFirebase } from '@/app/lib/firebase/FirebaseProvider';
import { useActivities } from '@/app/lib/hooks';

interface ActivityListProps {
  limit?: number;
  offset?: number;
}

export default function ActivityListAdminWrapper() {
    const { isAdmin } = useFirebase();

    if (!isAdmin) {
        return null;
    }

    return <ActivityList limit={10} offset={0} />;
}

type ActivityWithUser = activity.ActivityResponse & {
  user: user.UserResponse;
}

function ActivityList({ limit = 10, offset = 0 }: ActivityListProps) {
  const { user, isAdmin, token } = useFirebase();
  const { activities, isActivitiesLoading, error } = useActivities(token, offset, limit);

  if (!isAdmin) {
    return null;
  }

  if (isActivitiesLoading) {
    return <div>Loading activities...</div>;
  }

  if (error) {
    return <div className="text-red-500">Could not fetch activities</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Activity Log</h2>
      </div>
      
      {activities && activities.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center">
          <p className="text-sm text-gray-500">No activities recorded yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
          {activities && activities.map((activity) => (
            <li key={activity.id} className="relative flex gap-x-4 px-6 py-5 hover:bg-gray-50">
              <div className="flex-auto">
                <div className="flex items-center justify-between gap-x-4">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {activity.event}
                  </p>
                  <time className="flex-none text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </time>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {activity.user.display_name ? activity.user.display_name : activity.user.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
