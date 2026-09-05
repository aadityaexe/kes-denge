import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";

export const metadata = {
  title: "Admin Panel | MARK Technologies",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  let unreadCount = 0;
  if (session) {
    try {
      await connectToDatabase();
      unreadCount = await Message.countDocuments({ status: "new" });
    } catch (err) {
      // ignore
    }
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface-2 text-text-primary flex flex-col lg:flex-row">
        {session && (
          <AdminSidebar
            userEmail={session.email}
            userName={session.name || "Administrator"}
            unreadMessagesCount={unreadCount}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-surface-2">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
