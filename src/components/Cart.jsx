import { useState } from 'react'

const API_URL = 'https://acme-fashion-backend-91579245630.europe-west2.run.app'

export default function Cart({ items, onClose, onRemove, onUpdateQty, onOrderPlaced }) {
  const [step, setStep] = useState('cart') // cart | checkout | placing | done
  const [form, setForm] = useState({ name: '', email: '', street: '', city: '', postcode: '' })
  const [errors, setErrors] = useState({})

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal > 200 ? 0 : 9.99
  const total = subtotal + shipping

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.street.trim()) e.street = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.postcode.trim()) e.postcode = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function placeOrder() {
    if (!validate()) return
    setStep('placing')

    const payload = {
      customer: {
        name: form.name,
        email: form.email,
        address: {
          street: form.street,
          city: form.city,
          postcode: form.postcode,
          country: 'UK'
        }
      },
      items: items.map(i => ({
        sku: i.sku,
        name: i.name,
        size: i.size,
        qty: i.qty,
        price: i.price
      })),
      total: parseFloat(total.toFixed(2)),
      currency: 'GBP'
    }

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const order = await res.json()
      onOrderPlaced(order, order)
    } catch (err) {
      // Fallback mock if backend not reachable
      const mockOrder = {
        id: 'order_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        customer: {
          name: form.name,
          email: form.email,
          address: { street: form.street, city: form.city, postcode: form.postcode, country: 'UK' }
        },
        items: items.map(i => ({ sku: i.sku, name: i.name, size: i.size, qty: i.qty, price: i.price })),
        total: parseFloat(total.toFixed(2)),
        _demo: 'Generated client-side — backend not reachable'
      }
      onOrderPlaced(mockOrder, mockOrder)
    }
  }

  const inputStyle = (field) => ({
    width: '100%', height: 42,
    border: '1px solid',
    borderColor: errors[field] ? 'var(--error)' : 'var(--border)',
    borderRadius: 8, padding: '0 12px',
    fontSize: 14, color: 'var(--black)',
    background: 'var(--white)', outline: 'none',
    fontFamily: 'DM Sans, sans-serif'
  })

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        zIndex: 200, animation: 'fadeIn 0.2s ease'
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 420,
        background: 'var(--cream)', zIndex: 201,
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.3s ease',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20 }}>
              {step === 'cart' ? 'Your Bag' : step === 'placing' ? 'Placing Order...' : 'Checkout'}
            </h2>
            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} style={{
                background: 'none', border: 'none', fontSize: 12,
                color: 'var(--mid)', cursor: 'pointer', padding: 0, marginTop: 2
              }}>← Back to bag</button>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18, color: 'var(--mid)'
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Empty state */}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <p style={{ fontSize: 28, marginBottom: 12 }}>🛍</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, marginBottom: 6 }}>Your bag is empty</p>
              <p style={{ color: 'var(--mid)', fontSize: 12 }}>Add some pieces to get started.</p>
            </div>
          )}

          {/* Cart items */}
          {step === 'cart' && items.map(item => (
            <div key={item.key} style={{
              display: 'flex', gap: 12, marginBottom: 18,
              paddingBottom: 18, borderBottom: '1px solid var(--border)'
            }}>
              <img src={item.image} alt={item.name} style={{
                width: 64, height: 80, objectFit: 'cover',
                borderRadius: 8, flexShrink: 0, background: '#F0EDE8'
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: 'var(--mid)', marginBottom: 8 }}>{item.color} · Size {item.size}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px'
                  }}>
                    <button onClick={() => onUpdateQty(item.key, item.qty - 1)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--mid)', fontSize: 16, lineHeight: 1, padding: '0 2px'
                    }}>−</button>
                    <span style={{ fontSize: 13, minWidth: 14, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.key, item.qty + 1)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--mid)', fontSize: 16, lineHeight: 1, padding: '0 2px'
                    }}>+</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>£{(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => onRemove(item.key)} style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--mid)', fontSize: 11
                    }}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Checkout form */}
          {step === 'checkout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 4 }}>
                Delivery Details
              </p>
              {[
                { field: 'name', label: 'Full Name', type: 'text' },
                { field: 'email', label: 'Email Address', type: 'email' },
                { field: 'street', label: 'Street Address', type: 'text' },
                { field: 'city', label: 'City', type: 'text' },
                { field: 'postcode', label: 'Postcode', type: 'text' },
              ].map(({ field, label, type }) => (
                <div key={field}>
                  <label style={{ fontSize: 11, color: 'var(--mid)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input
                    type={type}
                    value={form[field]}
                    onChange={e => { setForm(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: '' })) }}
                    style={inputStyle(field)}
                  />
                  {errors[field] && <p style={{ fontSize: 11, color: 'var(--error)', marginTop: 3 }}>{errors[field]}</p>}
                </div>
              ))}

              {/* MongoDB note */}
              <div style={{
                background: '#001E2B', borderRadius: 8,
                padding: '12px 16px', marginTop: 8
              }}>
                <p style={{ fontSize: 10, color: '#00ED64', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                  MongoDB Atlas
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  This order saves as one document — customer, address, and all items together. No JOINs required.
                </p>
              </div>
            </div>
          )}

          {/* Placing order spinner */}
          {step === 'placing' && (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{
                width: 40, height: 40,
                border: '3px solid var(--border)',
                borderTopColor: 'var(--black)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 20px'
              }} />
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>Placing your order</p>
              <p style={{ color: 'var(--mid)', fontSize: 12, marginTop: 8 }}>Writing to MongoDB Atlas...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && step !== 'placing' && (
          <div style={{ padding: '18px 24px', borderTop: '1px solid var(--border)', background: 'var(--white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13, color: 'var(--mid)' }}>
              <span>Subtotal</span><span>£{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 13, color: 'var(--mid)' }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
            <button
              onClick={step === 'cart' ? () => setStep('checkout') : placeOrder}
              style={{
                width: '100%', height: 46,
                background: 'var(--black)', color: 'var(--white)',
                border: 'none', borderRadius: 10,
                fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
                fontWeight: 500, cursor: 'pointer'
              }}
            >
              {step === 'cart' ? 'Proceed to Checkout' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
