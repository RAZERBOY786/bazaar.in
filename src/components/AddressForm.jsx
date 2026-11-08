import { useState } from 'react'

const empty = {
  name: '',
  phone: '',
  pincode: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  type: 'Home',
}

const states = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

export default function AddressForm({ initial, onSubmit, submitLabel = 'Save address', compact = false }) {
  const [form, setForm] = useState({ ...empty, ...(initial || {}) })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name'
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ''))) next.phone = 'Enter a valid 10 digit mobile number'
    if (!/^[0-9]{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6 digit pincode'
    if (form.line1.trim().length < 5) next.line1 = 'Enter your address'
    if (form.city.trim().length < 2) next.city = 'Enter your city'
    if (!form.state) next.state = 'Select a state'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      phone: form.phone.replace(/\s/g, ''),
      line1: form.line1.trim(),
      city: form.city.trim(),
      state: form.state,
    })
  }

  return (
    <form className={`address-form ${compact ? 'compact' : ''}`} onSubmit={submit} noValidate>
      <div className="form-row">
        <label className="field">
          <span>Full name</span>
          <input value={form.name} onChange={set('name')} placeholder="Enter your full name" />
          {errors.name && <em>{errors.name}</em>}
        </label>
        <label className="field">
          <span>Mobile number</span>
          <input value={form.phone} onChange={set('phone')} placeholder="10 digit mobile number" inputMode="numeric" />
          {errors.phone && <em>{errors.phone}</em>}
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Pincode</span>
          <input value={form.pincode} onChange={set('pincode')} placeholder="6 digit pincode" inputMode="numeric" />
          {errors.pincode && <em>{errors.pincode}</em>}
        </label>
        <label className="field">
          <span>City</span>
          <input value={form.city} onChange={set('city')} placeholder="City" />
          {errors.city && <em>{errors.city}</em>}
        </label>
      </div>
      <label className="field">
        <span>Flat, House no., Building, Company, Apartment</span>
        <input value={form.line1} onChange={set('line1')} placeholder="Address line 1" />
        {errors.line1 && <em>{errors.line1}</em>}
      </label>
      <label className="field">
        <span>Area, Street, Sector, Village (optional)</span>
        <input value={form.line2} onChange={set('line2')} placeholder="Address line 2" />
      </label>
      <div className="form-row">
        <label className="field">
          <span>State</span>
          <select value={form.state} onChange={set('state')}>
            <option value="">Select state</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <em>{errors.state}</em>}
        </label>
        <div className="field">
          <span>Address type</span>
          <div className="type-toggle">
            {['Home', 'Work'].map((t) => (
              <button
                type="button"
                key={t}
                className={form.type === t ? 'active' : ''}
                onClick={() => setForm((prev) => ({ ...prev, type: t }))}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">{submitLabel}</button>
    </form>
  )
}
