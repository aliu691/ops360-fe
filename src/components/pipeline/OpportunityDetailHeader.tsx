import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Opportunity } from "../../types/pipeline";
import { StagePill } from "./StagePill";
import { useAuth } from "../../hooks/useAuth";
import { apiClient } from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import ConfirmDeleteModal from "../ConfirmDelete";

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
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = isAdmin || isSuperAdmin;

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await apiClient.delete(API_ENDPOINTS.deletePipelineDeal(deal.id));

      navigate("/opportunities");
    } catch (err) {
      console.error(err);
      alert("Failed to delete opportunity.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
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
              {canDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Delete
                </button>
              )}

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

      {/* ✅ Delete Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Opportunity"
        description={
          <>
            You are about to permanently delete <strong>{deal.dealName}</strong>
            .
            <br />
            This action cannot be undone.
          </>
        }
        loading={deleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
