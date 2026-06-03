export default function OrderConfirmation({ order, onContinue }) {
  if (!order) return null

  const orderId = order.id || order._id || order['_id'] ||
  (order.customer ? 'ORD-' + Date.now().toString().slice(-6) : 'N/A')

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>

      {/* Success icon */}
      <div style={{
        width: 72, height: 72, background: 'var(--black)',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', margin: '0 auto 28px'
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 10 }}>
        Order Confirmed
      </p>
      <h1 style={{
        fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 900,
        color: 'var(--black)', marginBottom: 16, lineHeight: 1.1
      }}>
        Thank you for<br />your order.
      </h1>
      <p style={{ color: 'var(--mid)', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Order <strong style={{ color: 'var(--black)' }}>{orderId}</strong> has been confirmed.
        {order.customer?.email && (
          <> We will send confirmation to <strong style={{ color: 'var(--black)' }}>{order.customer.email}</strong>.</>
        )}
      </p>

      {order._demo && (
        <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 8 }}>
          Demo mode — backend not reachable, order generated client-side.
        </p>
      )}

      {/* MongoDB highlight */}
      <div style={{
        background: '#001E2B', borderRadius: 14,
        padding: '24px 28px', margin: '36px 0', textAlign: 'left'
      }}>
        <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#00ED64', marginBottom: 8 }}>
          MongoDB Atlas — Live Document
        </p>
        <p style={{ color: 'white', fontSize: 15, fontFamily: 'Playfair Display, serif', marginBottom: 16, lineHeight: 1.5 }}>
          This order is stored as one document in Atlas — customer, address, and all items in a single write.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'MySQL tables replaced', value: '5' },
            { label: 'JOINs required', value: '0' },
            { label: 'Writes to DB', value: '1' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(0,237,100,0.1)',
              border: '1px solid rgba(0,237,100,0.3)',
              borderRadius: 8, padding: '10px 16px', flex: 1, minWidth: 90
            }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#00ED64', fontFamily: 'Playfair Display, serif' }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onContinue} style={{
        background: 'var(--black)', color: 'var(--white)',
        border: 'none', borderRadius: 8, padding: '12px 32px',
        fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
        fontWeight: 500, cursor: 'pointer'
      }}>
        Continue Shopping
      </button>
    </main>
  )
}
