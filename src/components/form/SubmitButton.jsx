export default function SubmitButton({
  children,
  loading,
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="
        w-full py-3 rounded-xl
        bg-blue-600 hover:bg-blue-700
        text-white font-semibold
        transition-all
        disabled:opacity-50
      "
    >
      {loading ? 'Memproses...' : children}
    </button>
  )
}