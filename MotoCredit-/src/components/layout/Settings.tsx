import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon, BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="mt-6">
        <div className="space-y-4">
          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900 dark:text-white" passive>
                Enable notifications
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications about important updates and activities
              </Switch.Description>
            </span>
            <Switch
              checked={notifications}
              onChange={setNotifications}
              className={classNames(
                notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  notifications ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </Switch.Group>

          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900 dark:text-white" passive>
                Email alerts
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
                Receive email notifications for important updates
              </Switch.Description>
            </span>
            <Switch
              checked={emailAlerts}
              onChange={setEmailAlerts}
              className={classNames(
                emailAlerts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  emailAlerts ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </Switch.Group>

          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900 dark:text-white" passive>
                SMS alerts
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
                Receive SMS notifications for critical updates
              </Switch.Description>
            </span>
            <Switch
              checked={smsAlerts}
              onChange={setSmsAlerts}
              className={classNames(
                smsAlerts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  smsAlerts ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </Switch.Group>

          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900 dark:text-white" passive>
                Dark mode
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
                Enable dark mode for better visibility in low light
              </Switch.Description>
            </span>
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={classNames(
                darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
              )}
            >
              <span className="sr-only">Enable dark mode</span>
              <span
                aria-hidden="true"
                className={classNames(
                  darkMode ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              >
                {darkMode ? (
                  <MoonIcon className="h-3 w-3 text-primary-600" />
                ) : (
                  <SunIcon className="h-3 w-3 text-gray-400" />
                )}
              </span>
            </Switch>
          </Switch.Group>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Save changes
        </button>
      </div>
    </div>
  );
} 