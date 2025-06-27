import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface Stats {
  name: string;
  stat: string;
  previousStat: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
  href: string;
}

const stats: Stats[] = [
  {
    name: 'Total Customers',
    stat: '71,897',
    previousStat: '70,946',
    change: '12%',
    changeType: 'increase',
    icon: UsersIcon,
    href: '/customers',
  },
  {
    name: 'Total Vehicles',
    stat: '58,123',
    previousStat: '56,789',
    change: '2.3%',
    changeType: 'increase',
    icon: TruckIcon,
    href: '/vehicles',
  },
  {
    name: 'Active Loans',
    stat: '24,455',
    previousStat: '23,976',
    change: '5.4%',
    changeType: 'increase',
    icon: CurrencyRupeeIcon,
    href: '/loans',
  },
  {
    name: 'EMIs Due Today',
    stat: '345',
    previousStat: '389',
    change: '4.1%',
    changeType: 'decrease',
    icon: CalendarIcon,
    href: '/emi-tracking',
  },
];

const recentActivity = [
  {
    id: 1,
    name: 'John Doe',
    title: 'New Loan Application',
    role: 'Customer',
    email: 'john@example.com',
    image:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    amount: '₹2,50,000',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Jane Smith',
    title: 'EMI Payment',
    role: 'Customer',
    email: 'jane@example.com',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    amount: '₹15,000',
    status: 'Completed',
  },
  // Add more activities as needed
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {item.stat}
              </p>
              <p
                className={classNames(
                  item.changeType === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-green-500 dark:text-green-400"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-red-500 dark:text-red-400"
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">
                  {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {item.change}
              </p>
            </dd>
          </Link>
        ))}
      </dl>

      <h3 className="mt-8 text-base font-semibold leading-6 text-gray-900 dark:text-white">
        Recent Activity
      </h3>

      <ul role="list" className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
        {recentActivity.map((person) => (
          <li
            key={person.id}
            className="flex items-center justify-between gap-x-6 py-5 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={person.image}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                  {person.name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {person.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm leading-6 text-gray-900 dark:text-white">
                {person.title}
              </p>
              <div className="mt-1 flex items-center gap-x-2">
                <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {person.amount}
                </p>
                <span
                  className={classNames(
                    person.status === 'Completed'
                      ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
                    'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                    person.status === 'Completed'
                      ? 'ring-green-600/20 dark:ring-green-400/20'
                      : 'ring-yellow-600/20 dark:ring-yellow-400/20'
                  )}
                >
                  {person.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
} 