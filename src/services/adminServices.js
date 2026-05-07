import api from '../api/axios'

export const getDashboard = async () => {
  const res = await api.get('/admin/dashboard')
  return res.data
}

export const getPendingPendaftaran = async () => {
  const res = await api.get(
    '/admin/pendaftaran?status=menunggu_persetujuan'
  )

  return res.data
}

export const getPendaftaran = async () => {
  const res = await api.get('/admin/pendaftaran')
  return res.data
}

export const approvePendaftaran = async (
  id,
  pembimbingId
) => {
  return api.post(
    `/admin/pendaftaran/${id}/setujui`,
    { pembimbing_id: pembimbingId }
  )
}

export const rejectPendaftaran = async (
  id,
  alasan
) => {
  return api.post(
    `/admin/pendaftaran/${id}/tolak`,
    { alasan_tolak: alasan }
  )
}