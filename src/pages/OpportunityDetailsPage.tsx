import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { Opportunity } from "../types/pipeline";
import { Header } from "../components/pipeline/OpportunityDetailHeader";
import { Stats } from "../components/pipeline/OpportunityDetailsStatCard";
import { MainGrid } from "../components/pipeline/OpportunityDetailsMainGrid";
import { DealForm } from "../components/pipeline/OpportunityCreateEditForm";

export default function OpportunityDetailsPage() {
  const { id } = useParams();

  const [deal, setDeal] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDeal = async () => {
      if (!id) return;

      try {
        const res = await apiClient.get(
          API_ENDPOINTS.getPipelineDealByExternalId(id)
        );
        setDeal(res.data.deal);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDeal();
  }, [id]);

  // 🔑 IMPORTANT: reset saving BEFORE entering edit mode
  const startEdit = () => {
    setSaving(false);
    setIsEditing(true);
  };

  if (loading) {
    return <div className="p-8">Loading opportunity…</div>;
  }

  if (!deal) {
    return <div className="p-8 text-red-500">Not found</div>;
  }

  return (
    <div className="space-y-8 pb-20 px-6 md:px-10 lg:px-14">
      <Header
        deal={deal}
        isEditing={isEditing}
        saving={saving}
        onEdit={startEdit}
        onCancel={() => setIsEditing(false)}
      />

      {isEditing ? (
        <DealForm
          mode="edit"
          deal={deal}
          saving={saving}
          setSaving={setSaving}
          onSaved={(updated) => {
            setDeal(updated);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <Stats deal={deal} />
          <MainGrid deal={deal} />
        </>
      )}
    </div>
  );
}
