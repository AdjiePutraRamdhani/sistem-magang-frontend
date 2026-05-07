export default function ErrorState({
  message
}) {
  return (
    <div style={{
      padding: '24px',
      textAlign: 'center',
      color: '#DC2626',
    }}>
      {message}
    </div>
  )
}