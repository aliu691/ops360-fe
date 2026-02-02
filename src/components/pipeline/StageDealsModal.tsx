import { useNavigate } from "react-router-dom";

interface Props {
  stageName: string;
  deals: any[];
  onClose: () => void;
}

export default function StageDealsModal({ stageName, deals, onClose }: Props) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-xl flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="font-semibold text-lg">{stageName} Deals</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {deals.length === 0 && (
            <p className="text-sm text-gray-500">No deals in this stage</p>
          )}

          {deals.map((deal) => (
            <div
              key={deal.externalDealId}
              className="border rounded-lg p-4 hover:bg-gray-50"
              onClick={() => navigate(`/opportunities/${deal.externalDealId}`)}
            >
              <div className="font-medium">{deal.dealName}</div>
              <div className="text-sm text-gray-600">
                {deal.organizationName}
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="font-semibold">
                  ₦{deal.displayValue?.toLocaleString("en-NG")}
                </span>
                <span className="text-gray-500">
                  {deal.salesOwner?.firstName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
