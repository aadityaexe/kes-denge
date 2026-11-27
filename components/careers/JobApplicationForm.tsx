"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function JobApplicationForm({ jobId, jobTitle }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    location: "",
    currentRole: "",
    experienceYears: "",
    noticePeriod: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    coverLetter: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit application. Please check your details.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error while submitting application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-xl font-display font-semibold text-text-primary">
          Application Received!
        </h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          Thank you for applying for <strong>{jobTitle}</strong>. Our hiring team will review your profile and reach out to <strong>{formData.email}</strong> if there&apos;s a match.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              applicantName: "",
              email: "",
              phone: "",
              location: "",
              currentRole: "",
              experienceYears: "",
              noticePeriod: "",
              linkedinUrl: "",
              portfolioUrl: "",
              resumeUrl: "",
              coverLetter: "",
            });
          }}
          className="mt-2 inline-flex items-center px-4 py-2 rounded-full border border-[var(--color-border)] text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-5"
    >
      <div>
        <h3 className="text-xl font-display font-semibold text-text-primary">
          Apply for this Role
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          Fields marked with * are required.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            name="applicantName"
            required
            value={formData.applicantName}
            onChange={handleChange}
            placeholder="Aarav Sharma"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="aarav@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Current Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Bengaluru, India"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Current Role / Title
          </label>
          <input
            type="text"
            name="currentRole"
            value={formData.currentRole}
            onChange={handleChange}
            placeholder="Frontend Engineer"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Years of Experience
          </label>
          <input
            type="text"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            placeholder="3 years"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Notice Period
          </label>
          <input
            type="text"
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleChange}
            placeholder="Immediate / 30 days"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Resume / CV Link (Google Drive, Dropbox, PDF URL)
          </label>
          <input
            type="url"
            name="resumeUrl"
            value={formData.resumeUrl}
            onChange={handleChange}
            placeholder="https://drive.google.com/..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Portfolio / GitHub URL
          </label>
          <input
            type="url"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-primary mb-1.5">
          Cover Letter / Why are you a great fit? *
        </label>
        <textarea
          name="coverLetter"
          required
          rows={5}
          value={formData.coverLetter}
          onChange={handleChange}
          placeholder="Tell us about projects you've shipped, your technical strengths, and why you'd like to join MARK 2..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)] resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] disabled:opacity-60 transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Submitting Application...
          </>
        ) : (
          <>
            <Send size={15} /> Submit Application
          </>
        )}
      </button>
    </form>
  );
}
