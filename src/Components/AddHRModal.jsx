import React, { useState } from 'react';

export default function AddHRModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    technology: '',
    mobile: '',
    jobType: '',
    company: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to API
    // eslint-disable-next-line no-console
    console.log('Add HR', form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="px-6 py-5 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Add HR</h3>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">* HR Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm bg-white"
                  placeholder="Enter HR Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">* Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm bg-white"
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">* Job Type</label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm bg-white"
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
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm bg-white"
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
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm bg-white"
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
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-sm bg-white"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm text-gray-700 bg-white"
            >
              ✕ Close
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-400 hover:bg-emerald-500 text-white font-semibold"
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

