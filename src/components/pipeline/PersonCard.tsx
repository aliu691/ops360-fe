import { User } from "../../types/user";

export interface Person {
  firstName: string;
  lastName: string;
  email?: string;
  department?: string;
}

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: { person: User }) {
  const initials = `${person.firstName[0]}${person.lastName[0]}`;

  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center font-bold uppercase">
        {initials}
      </div>

      <div className="flex-1">
        <p className="font-medium">
          {person.firstName} {person.lastName}
        </p>
        <p className="text-sm text-gray-500">{person.department}</p>
      </div>

      {person.email && (
        <a
          href={`mailto:${person.email}`}
          className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
        >
          Email
        </a>
      )}
    </div>
  );
}
