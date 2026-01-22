import { useEffect, useRef, useState } from "react";
import { Input } from "../Input";
import { Textarea } from "../TextArea";
import { API_ENDPOINTS } from "../../config/api";
import { apiClient } from "../../config/apiClient";
import { Opportunity } from "../../types/pipeline";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  department: "SALES" | "PRE_SALES";
};

type Props = {
  mode: "create" | "edit";
  deal?: Opportunity;
  saving: boolean;
  setSaving: (v: boolean) => void;
  onSaved: (deal: Opportunity) => void;
};

export function DealForm({ mode, deal, saving, setSaving, onSaved }: Props) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    organizationName: deal?.organizationName ?? "",
    dealName: deal?.dealName ?? "",
    dealValue: deal?.displayValue ?? "",
    expectedCloseDate: deal ? deal.expectedCloseDate.slice(0, 10) : "",
    stageId: deal?.displayStage?.id ?? "",
    nextAction: deal?.nextAction ?? "",

    salesOwnerId: deal?.salesOwner?.id ?? "",
    preSalesOwnerIds: deal?.preSalesOwners?.map((u) => u.id) ?? [],

    // 🔴 RED FLAG
    hasRedFlag: Boolean(deal?.redFlag),
    redFlag: deal?.redFlag ?? "",
  });

  const [stages, setStages] = useState<
    { id: number; name: string; probability: number }[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPresalesDropdown, setShowPresalesDropdown] = useState(false);

  const savingRef = useRef(false);

  const salesUsers = users.filter((u) => u.department === "SALES");
  const preSalesUsers = users.filter((u) => u.department === "PRE_SALES");

  useEffect(() => {
    apiClient.get(API_ENDPOINTS.getDealStages()).then((res) => {
      setStages(res.data.items ?? []);
    });

    apiClient.get(API_ENDPOINTS.getUsers()).then((res) => {
      setUsers(res.data.items ?? []);
    });
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        organizationName: form.organizationName,
        dealName: form.dealName,
        dealValue: form.dealValue ? Number(form.dealValue) : null,
        expectedCloseDate: form.expectedCloseDate,
        stageId: form.stageId ? Number(form.stageId) : null,
        nextAction: form.nextAction || null,

        salesOwnerId: Number(form.salesOwnerId),
        preSalesOwnerIds: form.preSalesOwnerIds,

        // 🔴 RED FLAG LOGIC
        redFlag: form.hasRedFlag && form.redFlag ? form.redFlag : null,
      };

      const res =
        mode === "edit"
          ? await apiClient.patch(
              API_ENDPOINTS.updatePipelineDeal(deal!.externalDealId),
              payload
            )
          : await apiClient.post(API_ENDPOINTS.createPipelineDeal(), payload);

      onSaved(res.data.deal);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-6">
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <h3 className="font-semibold">
          {isEdit ? "Edit Deal" : "Create Deal"}
        </h3>

        <Input
          label="Organization Name"
          value={form.organizationName}
          onChange={(v) => update("organizationName", v)}
        />

        <Input
          label="Opportunity Name"
          value={form.dealName}
          onChange={(v) => update("dealName", v)}
        />

        <Input
          label="Deal Amount (NGN)"
          value={form.dealValue}
          onChange={(v) => update("dealValue", v)}
        />

        {/* STAGE */}
        <div>
          <label className="block text-sm font-medium mb-1">Deal Stage</label>
          <select
            value={form.stageId}
            onChange={(e) => update("stageId", Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Select stage</option>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.probability}%)
              </option>
            ))}
          </select>
        </div>

        {/* SALES OWNER */}
        <div>
          <label className="block text-sm font-medium mb-1">Sales Owner</label>
          <select
            value={form.salesOwnerId}
            onChange={(e) => update("salesOwnerId", Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Select sales owner</option>
            {salesUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* PRESALES */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">
            Presales Representatives
          </label>

          <button
            type="button"
            onClick={() => setShowPresalesDropdown((v) => !v)}
            className="w-full flex justify-between items-center border rounded-lg px-3 py-2 text-sm"
          >
            {form.preSalesOwnerIds.length === 0
              ? "Select presales reps"
              : preSalesUsers
                  .filter((u) => form.preSalesOwnerIds.includes(u.id))
                  .map((u) => `${u.firstName} ${u.lastName}`)
                  .join(", ")}
            <span>▾</span>
          </button>

          {showPresalesDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow max-h-56 overflow-auto">
              {preSalesUsers.map((u) => {
                const checked = form.preSalesOwnerIds.includes(u.id);
                return (
                  <label
                    key={u.id}
                    className="flex gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        update(
                          "preSalesOwnerIds",
                          checked
                            ? form.preSalesOwnerIds.filter((id) => id !== u.id)
                            : [...form.preSalesOwnerIds, u.id]
                        )
                      }
                    />
                    {u.firstName} {u.lastName}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <Input
          type="date"
          label="Expected Close"
          value={form.expectedCloseDate}
          onChange={(v) => update("expectedCloseDate", v)}
        />

        <Textarea
          label="Next Action"
          value={form.nextAction}
          onChange={(v) => update("nextAction", v)}
        />

        {/* 🔴 RED FLAG */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.hasRedFlag}
              onChange={(e) => update("hasRedFlag", e.target.checked)}
            />
            This deal has a red flag
          </label>

          {form.hasRedFlag && (
            <Textarea
              label="Red Flag Details"
              value={form.redFlag}
              onChange={(v) => update("redFlag", v)}
            />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border p-3 rounded-lg">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Deal"}
        </button>
      </div>
    </form>
  );
}
