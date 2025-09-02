export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} Smart Drink Ordering System. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
