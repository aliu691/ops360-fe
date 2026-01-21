import { User } from "../../types/user";
import { PersonCard } from "./PersonCard";

export function OwnerSection({
  title,
  owners,
}: {
  title: string;
  owners: User[];
}) {
  if (owners.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold mb-4">{title}</h3>
        <p className="text-sm text-gray-500">
          No {title.toLowerCase()} assigned
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="space-y-4">
        {owners.map((owner) => (
          <PersonCard key={owner.id} person={owner} />
        ))}
      </div>
    </div>
  );
}
