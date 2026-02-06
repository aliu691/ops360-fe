import { Opportunity } from "../../types/pipeline";
import { StagePill } from "./StagePill";

export function Header({
  deal,
  isEditing,
  saving,
  onEdit,
  onCancel,
}: {
  deal: Opportunity;
  isEditing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{deal.dealName}</h1>
          <StagePill
            probability={deal.displayStage?.probability}
            label={deal.displayStage?.name}
          />
        </div>

        <p className="text-gray-500 mt-1">{deal.organizationName}</p>
      </div>

      <div className="flex gap-3">
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
        ) : (
          <>
            <button className="px-4 py-2 border rounded-lg text-red-600">
              Delete
            </button>

            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Edit Opportunity
            </button>
          </>
        )}
      </div>
    </div>
  );
}
