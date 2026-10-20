import Input from "../ui/Input.jsx";
import Textarea from "../ui/Textarea.jsx";

function RojnamaFields({ form, onChange, readOnly = false }) {
  return (
    <div className="grid gap-5">
      <Input
        label="Hearing date"
        id="hearingDate"
        name="hearingDate"
        type="date"
        value={form.hearingDate}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Input
        label="Purpose"
        id="purpose"
        name="purpose"
        value={form.purpose}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Textarea
        label="Business"
        id="business"
        name="business"
        value={form.business}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Textarea
        label="Order directions"
        id="orderDirections"
        name="orderDirections"
        value={form.orderDirections}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Input
        label="Next hearing date"
        id="nextHearingDate"
        name="nextHearingDate"
        type="date"
        value={form.nextHearingDate}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
}

export default RojnamaFields;
