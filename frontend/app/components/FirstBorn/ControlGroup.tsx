export default function ControlGroup ({title, children}) => ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="control-group border p-4 rounded-lg mb-4">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};
