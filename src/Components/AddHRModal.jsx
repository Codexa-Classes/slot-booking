import React, { useEffect, useState } from 'react';

export default function AddHRModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    technology: '',
    mobile: '',
    jobType: '',
    company: '',
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Escape key + scroll lock
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call parent handler if provided
    if (onAdd) {
      try {
        // create an id for the HR
        const newHR = { id: Date.now(), ...form };
        await onAdd(newHR);
        
        // Show success toast in form header
        setShowSuccessToast(true);
        
        // Hide toast after 2 seconds and close modal
        setTimeout(() => {
          setShowSuccessToast(false);
          // reset form
          setForm({
            name: '',
            email: '',
            technology: '',
            mobile: '',
            jobType: '',
            company: '',
          });
          onClose();
        }, 2000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to add HR:', err);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('Add HR', form);
      // reset form (optional)
      setForm({
        name: '',
        email: '',
        technology: '',
        mobile: '',
        jobType: '',
        company: '',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 z-10">
        <div className="px-6 py-4 border-b flex items-center justify-between relative">
          <h3 className="text-base font-semibold text-gray-800">Add New HR</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
          </button>
          
          {/* Success Toast in Form Header */}
          {showSuccessToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300">
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold text-xs">HR Created Successfully</span>
              </div>
            </div>
          )}
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  <span className="text-red-500">*</span> HR Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                  placeholder="Enter HR Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Job Type
                </label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                >
                  <option value="">Select Job Type</option>
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Company Name
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                  placeholder="Enter Company Name"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Technology
                </label>
                <select
                  name="technology"
                  value={form.technology}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                >
                  <option value="">Select Technology</option>
                  <option value="react">React</option>
                  <option value="node">Node</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Mobile</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                  placeholder="Enter 10 digit number"
                />
                <ul className="mt-2 text-xs text-red-500 list-disc list-inside">
                  <li>Don't include +91</li>
                  <li>Don't use your own mobile number.</li>
                </ul>
              </div>

              <div className="h-12" /> {/* spacer to align with left column */}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 bg-white h-9"
            >
              ✕ Close
            </button>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2 h-9"
            >
              + Add New HR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

