import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 h-full">
      <nav className="space-y-2">
        <Link href="/dashboard" className="block px-2 py-1 rounded hover:bg-gray-200">
          Dashboard
        </Link>
        <Link href="/tasks" className="block px-2 py-1 rounded hover:bg-gray-200">
          My Tasks
        </Link>
        <Link href="/tasks/create" className="block px-2 py-1 rounded hover:bg-gray-200">
          New Task
        </Link>
      </nav>
    </aside>
  );
}
