import { Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";

function ClerkRojnamaPlaceholder() {
  return (
    <div className="space-y-5">
      <Link
        to="/clerk/pending"
        className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
      >
        Back to pending Rojnamas
      </Link>
      <Card className="p-6">
        <p className="text-base font-semibold text-brand-navy">
          Review page coming soon
        </p>
      </Card>
    </div>
  );
}

export default ClerkRojnamaPlaceholder;
