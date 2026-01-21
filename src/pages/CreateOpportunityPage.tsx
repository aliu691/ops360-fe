import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealForm } from "../components/pipeline/OpportunityCreateEditForm";

export default function CreateOpportunityPage() {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <DealForm
        mode="create"
        saving={saving}
        setSaving={setSaving}
        onSaved={(created) => {
          navigate(`/opportunities/${created.externalDealId}`);
        }}
      />
    </div>
  );
}
