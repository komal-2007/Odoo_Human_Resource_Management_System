// Private Info tab — personal/contact details, view-only.
function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink-secondary mb-1">{label}</p>
      <p className="text-sm border-b border-base-border pb-2">{value}</p>
    </div>
  )
}

export default function PrivateInfoTab({ employee }) {
  const { privateInfo } = employee

  return (
    <div className="bg-base-panel border border-base-border rounded-xl p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        <Field label="Personal Email" value={privateInfo.personalEmail} />
        <Field label="Phone" value={privateInfo.phone} />
        <Field label="Address" value={privateInfo.address} />
        <Field label="Date of Birth" value={privateInfo.dateOfBirth} />
        <Field label="Marital Status" value={privateInfo.maritalStatus} />
      </div>
    </div>
  )
}
