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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call parent handler if provided
    if (onAdd) {
      // create an id for the HR
      const newHR = { id: Date.now(), ...form };
      onAdd(newHR);
    }
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
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="px-6 py-4 border-b">
          <h3 className="text-base font-semibold text-gray-800">Add New HR</h3>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">* HR Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                  placeholder="Enter HR Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">* Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">* Job Type</label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white h-9"
                >
                  <option value="">Select Job Type</option>
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">* Company Name</label>
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
                <label className="block text-xs font-semibold text-gray-700">* Technology</label>
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-lime-400 hover:bg-lime-500 text-white font-semibold h-9"
            >
              <span className="text-lg font-bold">+</span>
              Add New HR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

