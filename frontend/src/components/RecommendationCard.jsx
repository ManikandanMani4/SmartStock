import {
  Package,
  ArrowRight,
} from "lucide-react";

function RecommendationCard({
  product,
  currentStock,
  predictedDemand,
  orderQuantity,
  risk,
}) {
  return (
    <div className="recommendation-card">

      <div className="recommendation-icon">
        <Package size={22} />
      </div>

      <div className="recommendation-info">

        <div className="recommendation-title">
          <h4>{product}</h4>

          <span className={`risk ${risk.toLowerCase()}`}>
            {risk} Risk
          </span>
        </div>

        <div className="recommendation-details">

          <span>
            Stock: <strong>{currentStock}</strong>
          </span>

          <span>
            Predicted: <strong>{predictedDemand}</strong>
          </span>

        </div>

      </div>

      <div className="order-action">

        <span>Order</span>

        <strong>{orderQuantity}</strong>

        <ArrowRight size={18} />

      </div>

    </div>
  );
}

export default RecommendationCard;