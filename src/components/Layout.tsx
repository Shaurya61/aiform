// components/Layout.tsx
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="container bg-gray-50">
        {children}
      </div>
    );
  };
  
  export default Layout;
  