// Resume tab — the employee's professional/job-related info.
export default function ResumeTab({ employee }) {
  const { resume } = employee

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <section className="bg-base-panel border border-base-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-2">About</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {resume.about}
          </p>
        </section>

        <section className="bg-base-panel border border-base-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-2">
            What I love about my job
          </h3>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {resume.whatILoveAboutMyJob}
          </p>
        </section>
      </div>

      <div className="space-y-4">
        <section className="bg-base-panel border border-base-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-3">Skills</h3>
          {resume.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-secondary">No skills added.</p>
          )}
        </section>

        <section className="bg-base-panel border border-base-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-3">
            Certification
          </h3>
          {resume.certifications.length > 0 ? (
            <ul className="space-y-1.5">
              {resume.certifications.map((cert) => (
                <li key={cert} className="text-sm text-ink-secondary">
                  {cert}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ink-secondary">
              No certifications added.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
