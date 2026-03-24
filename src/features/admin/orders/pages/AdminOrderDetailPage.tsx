import { useParams } from "react-router-dom";

const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-foreground">Order Detail</h1>
        <p className="text-sm text-foreground/60 mt-1">Order ID: {id}</p>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;