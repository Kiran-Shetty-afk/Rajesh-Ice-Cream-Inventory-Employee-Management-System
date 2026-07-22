type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6 flex items-end justify-between gap-4">
      <div className="border-l-4 border-strawberry pl-4">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-cocoa/70">{description}</p>
      </div>
    </header>
  );
}
