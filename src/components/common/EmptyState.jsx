export default function EmptyState({
  message
}) {
  return (
    <p
      style={{
        padding: '24px',
        textAlign: 'center',
        color: '#aaa',
        margin: 0,
      }}
    >
      {message}
    </p>
  )
}