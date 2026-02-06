import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { AuditLog } from "../types/audit";

export default function AuditLogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getAuditLogById(id!))
      .then((res) => setLog(res.data.item))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8">Loading…</div>;
  if (!log) return <div className="p-8">Log not found</div>;

  const actor = log.actor;

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600">
        ← Back to Audit Logs
      </button>

      {/* HEADER */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Badge>{log.action}</Badge>
          {log.entity && (
            <span className="text-sm text-gray-500">Entity: {log.entity}</span>
          )}
        </div>

        <h1 className="text-2xl font-bold">{log.description}</h1>

        <div className="text-sm text-gray-500">
          {new Date(log.createdAt).toLocaleString()}
        </div>
      </div>

      {/* ACTOR INFO */}
      <Section title="Actor Information">
        <div className="grid grid-cols-2 gap-6">
          <Info label="Actor Type" value={actor?.type ?? log.actorType} />
          <Info label="Actor ID" value={actor?.id ?? log.actorId} />

          {actor?.type === "USER" && (
            <>
              <Info label="Name" value={actor.name} />
              <Info label="Email" value={actor.email} />
              <Info label="Department" value={actor.department} />
            </>
          )}

          {actor?.type === "ADMIN" && (
            <>
              <Info label="Email" value={actor.email} />
              <Info label="Role" value={actor.role} />
            </>
          )}

          <Info label="IP Address" value={log.ipAddress ?? "—"} />
          <Info label="User Agent" value={log.userAgent ?? "—"} />
        </div>
      </Section>

      {/* ACTION UI */}
      {log.action === "UPDATE_PIPELINE_OPPORTUNITY" && (
        <DiffSection metadata={log.metadata} />
      )}

      {log.action === "CREATE_PIPELINE_OPPORTUNITY" && (
        <OpportunitySection metadata={log.metadata} />
      )}

      {log.action === "UPLOAD_MEETINGS" && (
        <KeyValueSection title="Upload Summary" data={log.metadata} />
      )}

      {!isKnownAction(log.action) && <RawMetadata metadata={log.metadata} />}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{String(value)}</div>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
      {children.replace(/_/g, " ")}
    </span>
  );
}

/* ================= ACTION SECTIONS ================= */

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}/.test(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB");
}

function formatValue(value: any) {
  if (value === null || value === undefined) return "—";

  if (typeof value === "string") {
    if (isIsoDate(value)) {
      return formatDate(value);
    }
    return value; // 👈 dealName will NEVER hit Date()
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return String(value);
}

function DiffSection({ metadata }: { metadata?: any }) {
  if (!metadata?.before || !metadata?.after) return null;

  const keys = Array.from(
    new Set([...Object.keys(metadata.before), ...Object.keys(metadata.after)])
  );

  return (
    <Section title="Detailed Changes">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-gray-500">
          <tr>
            <th className="text-left py-2">Field</th>
            <th className="text-left py-2">Before</th>
            <th className="text-left py-2">After</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key} className="border-t">
              <td className="py-2 font-medium">{key}</td>
              <td className="py-2 text-red-600">
                {formatValue(metadata.before[key])}
              </td>
              <td className="py-2 text-green-600">
                {formatValue(metadata.after[key])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

function OpportunitySection({ metadata }: { metadata?: any }) {
  if (!metadata) return null;

  return (
    <Section title="Opportunity Details">
      <div className="grid grid-cols-3 gap-6">
        <Info label="Year" value={metadata.year} />
        <Info label="Quarter" value={metadata.quarter} />
        <Info label="Source" value={metadata.source} />

        <Info label="Deal Name" value={metadata.dealName} />
        <Info label="Deal Value" value={metadata.dealValue} />

        {metadata.externalDealId && (
          <div>
            <div className="text-xs text-gray-500">Deal</div>
            <a
              href={`/opportunities/${metadata.externalDealId}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {metadata.externalDealId}
            </a>
          </div>
        )}
      </div>
    </Section>
  );
}

function KeyValueSection({
  title,
  data,
}: {
  title: string;
  data?: Record<string, any>;
}) {
  if (!data) return null;

  return (
    <Section title={title}>
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(data).map(([key, value]) => (
          <Info key={key} label={key} value={value} />
        ))}
      </div>
    </Section>
  );
}

function RawMetadata({ metadata }: { metadata?: any }) {
  return (
    <Section title="Raw Metadata">
      {metadata ? (
        <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500 text-sm">No metadata</p>
      )}
    </Section>
  );
}

function isKnownAction(action: string) {
  return [
    "UPDATE_PIPELINE_OPPORTUNITY",
    "CREATE_PIPELINE_OPPORTUNITY",
    "UPLOAD_MEETINGS",
  ].includes(action);
}
