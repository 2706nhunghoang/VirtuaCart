import Header from "./Header";

function Layout({ children, onNavigate  }) {
  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="bg-surface dark:bg-surface-dark">{children}</main>
    </>
  );
}

export default Layout;
