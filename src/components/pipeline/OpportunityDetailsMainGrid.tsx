import { Opportunity } from "../../types/pipeline";
import { OwnerSection } from "./OpportunityDetailsDealOwner";

export function MainGrid({ deal }: { deal: Opportunity }) {
  const salesOwners = deal.salesOwner ? [deal.salesOwner] : [];

  const preSalesOwners = Array.isArray(deal.preSalesOwners)
    ? deal.preSalesOwners
    : [];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <DealInfo deal={deal} />
        <CompanyInfo deal={deal} />
      </div>

      {/* RIGHT */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* <OwnerSection title="Deal Owner" owners={salesOwners} />
        <OwnerSection title="Presales Representative" owners={preSalesOwners} /> */}
        <OwnerSection
          title="Deal Owner"
          owners={deal.salesOwner ? [deal.salesOwner] : []}
        />

        <OwnerSection
          title="Presales Representative"
          owners={Array.isArray(deal.preSalesOwners) ? deal.preSalesOwners : []}
        />
      </div>
    </div>
  );
}

function DealInfo({ deal }: { deal: Opportunity }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="flex justify-between px-6 py-4 border-b">
        <h3 className="font-semibold">Deal Info</h3>
        {/* <button className="text-blue-600 text-sm">Update</button> */}
      </div>

      <div className="p-6 grid grid-cols-2 gap-6 text-sm">
        <Info label="Opportunity Name" value={deal.dealName} />
        <Info label="Current Stage" value={deal.displayStage?.name} />

        <div className="col-span-2">
          <p className="text-gray-500">Next Action</p>
          <p className="mt-1">{deal.nextAction || "—"}</p>
        </div>

        {deal.redFlag && (
          <div className="col-span-2 text-red-600">
            <p className="text-gray-500">Red Flag</p>
            <p className="mt-1">{deal.redFlag}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium mt-1">{value || "—"}</p>
    </div>
  );
}

function CompanyInfo({ deal }: { deal: Opportunity }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="flex justify-between px-6 py-4 border-b">
        <h3 className="font-semibold">Company Info</h3>
        {/* <button className="text-blue-600 text-sm">View Organization</button> */}
      </div>

      <div className="p-6">
        <p className="">{deal.organizationName}</p>
        {/* <p className="text-sm text-gray-500 mt-1">Financial Services • NG</p> */}
      </div>
    </div>
  );
}

function Timeline({ deal }: { deal: Opportunity }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold mb-4">Timeline</h3>

      <ul className="space-y-4 text-sm">
        <li>➕ Created</li>
        <li>🤝 Negotiation Started</li>
        <li>📄 Contract Sent</li>
        {deal.displayStage?.key === "CLOSE_WON" && <li>✅ Deal Won</li>}
      </ul>
    </div>
  );
}
