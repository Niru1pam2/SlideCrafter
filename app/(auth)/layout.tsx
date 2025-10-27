export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
}
