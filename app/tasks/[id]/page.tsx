export default function TaskDetailsPage({ params }: { params: { id: string } }) {
  return <div>Task Details for {params.id}</div>;
}
