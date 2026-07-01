import { motion } from 'framer-motion'
import { ADMIN_MENU } from '../../constants/adminMenu'
import { useState, useEffect } from 'react'
import { FileSpreadsheet, FileText, Search, Download } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import useDashboard from '../../hooks/useDashboard'
import Loading from '../../components/common/Loading'
import DashboardTable from '../../components/dashboard/DashboardTable'
import PageHeader from '../../components/common/PageHeader'
import PageTitle from '../../components/common/PageTitle'
import Card from '../../components/ui/Card'
import api from '../../api/axios'
import { formatTanggal } from '@/utils/formatTanggal'

export default function KelolaData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mahasiswa, setMahasiswa] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchMahasiswa()
  }, [])

  const fetchMahasiswa = async () => {
    try {
      const response = await api.get('/admin/mahasiswa')

      console.log(response.data)

      setMahasiswa(response.data)
    } catch (err) {
      console.error(err)
      console.error(err.response)

      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal mengambil data mahasiswa'
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredMahasiswa = mahasiswa.filter((item) => {
    const matchesSearch =
      (item.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.asal_instansi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.program_studi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.pembimbing || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter ? item.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const handleExportExcel = () => {
    const headers = [
      'No',
      'Nama Lengkap',
      'Email',
      'Asal Instansi',
      'Program Studi',
      'Tanggal Mulai',
      'Tanggal Selesai',
      'Status',
      'Pembimbing'
    ]

    const csvRows = [headers.join(';')]

    filteredMahasiswa.forEach((item, index) => {
      const row = [
        index + 1,
        `"${(item.nama_lengkap || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${(item.asal_instansi || '').replace(/"/g, '""')}"`,
        `"${(item.program_studi || '').replace(/"/g, '""')}"`,
        formatTanggal(item.tanggal_mulai),
        formatTanggal(item.tanggal_selesai),
        item.status,
        `"${(item.pembimbing || '-').replace(/"/g, '""')}"`
      ]
      csvRows.push(row.join(';'))
    })

    const csvContent = '\ufeff' + csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Rekap_Laporan_Magang_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank')
    const title = 'REKAP LAPORAN DATA MAGANG MAHASISWA'
    const todayStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const rowsHtml = filteredMahasiswa.map((item, index) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; text-align: center;">${index + 1}</td>
        <td style="padding: 8px;"><strong>${item.nama_lengkap || ''}</strong></td>
        <td style="padding: 8px;">${item.asal_instansi || ''}</td>
        <td style="padding: 8px;">${item.program_studi || ''}</td>
        <td style="padding: 8px; text-align: center;">${formatTanggal(item.tanggal_mulai)} s/d ${formatTanggal(item.tanggal_selesai)}</td>
        <td style="padding: 8px; text-align: center;"><span style="text-transform: capitalize;">${item.status || ''}</span></td>
        <td style="padding: 8px;">${item.pembimbing || '-'}</td>
      </tr>
    `).join('')

    const htmlContent = `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #2d3748;
            margin: 40px;
            font-size: 12px;
            line-height: 1.5;
          }
          .header-container {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px double #2d3748;
            padding-bottom: 15px;
          }
          .header-title {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 5px 0;
          }
          .header-subtitle {
            font-size: 12px;
            color: #4a5568;
            margin: 0;
          }
          .meta-table {
            width: 100%;
            margin-bottom: 20px;
          }
          .meta-table td {
            padding: 2px 0;
          }
          .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .report-table th {
            background-color: #edf2f7;
            border: 1px solid #cbd5e0;
            padding: 10px 8px;
            font-weight: bold;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
          }
          .report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px;
            font-size: 11px;
          }
          .report-table tr:nth-child(even) {
            background-color: #f7fafc;
          }
          .footer-section {
            margin-top: 50px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
          }
          .signature-box {
            text-align: center;
            width: 250px;
          }
          .signature-space {
            height: 70px;
          }
          @media print {
            body { margin: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <h1 class="header-title">Sistem Informasi Magang Mahasiswa</h1>
          <p class="header-subtitle">Laporan Rekapitulasi Data Peserta Magang</p>
        </div>

        <table class="meta-table">
          <tr>
            <td style="width: 15%;"><strong>Tanggal Cetak</strong></td>
            <td style="width: 2%;">:</td>
            <td>${todayStr}</td>
          </tr>
          <tr>
            <td><strong>Total Peserta</strong></td>
            <td>:</td>
            <td>${filteredMahasiswa.length} Peserta</td>
          </tr>
        </table>

        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 5%; text-align: center;">No</th>
              <th style="width: 25%;">Nama Peserta</th>
              <th style="width: 20%;">Asal Instansi</th>
              <th style="width: 15%;">Program Studi</th>
              <th style="width: 15%; text-align: center;">Periode</th>
              <th style="width: 10%; text-align: center;">Status</th>
              <th style="width: 15%;">Pembimbing</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #718096;">Tidak ada data magang ditemukan.</td></tr>'}
          </tbody>
        </table>

        <div class="footer-section">
          <div class="signature-box">
            <p>Disetujui Oleh,</p>
            <p style="font-weight: bold; margin-top: 5px;">Administrator Sistem Magang</p>
            <div class="signature-space"></div>
            <p style="text-decoration: underline; font-weight: bold;">................................................</p>
            <p style="font-size: 10px; color: #718096; margin: 0;">NIP/NIK Admin</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data mahasiswa magang ini? Semua data terkait seperti penilaian dan sertifikat juga akan dihapus.')) {
      return
    }

    try {
      setLoading(true)
      const response = await api.delete(`/admin/mahasiswa/${id}`)
      alert(response.data.message || 'Data berhasil dihapus.')
      await fetchMahasiswa()
    } catch (err) {
      console.error(err)
      alert(
        err.response?.data?.message ||
        err.message ||
        'Gagal menghapus data mahasiswa'
      )
      setLoading(false)
    }
  }

  if (loading) {
        return (
          <DashboardLayout menuItems={ADMIN_MENU}>
            <Loading />
          </DashboardLayout>
        )
      }
    
      if (error) {
        return (
          <DashboardLayout menuItems={ADMIN_MENU}>
             <div className="text-red-500">{error}</div>
          </DashboardLayout>
        )
      }
  
  return (
    <>
      <PageTitle title="Dashboard Admin" />
        <DashboardLayout menuItems={ADMIN_MENU}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-8"
        >            
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="
            relative overflow-hidden
            rounded-3xl
            bg-gradient-to-br
            from-slate-900
            via-blue-900
            to-indigo-900
            p-8 md:p-10
            text-white
          "
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white rounded-full" />
            <div className="absolute bottom-0 left-0 w-52 h-52 bg-white rounded-full" />
          </div>

          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold"
            >
              Kelola Data Magang 📝
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="
                mt-4
                text-blue-100
                max-w-2xl
                leading-relaxed
              "
            >
              Kelola data peserta magang.
            </motion.p>
          </div>
        </motion.div>
          <Card className="space-y-6">
            {/* Search, Filter, and Export Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari nama, instansi, prodi, pembimbing..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                  />
                </div>
                {/* Status Filter */}
                <div className="w-full sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-gray-700"
                  >
                    <option value="">Semua Status</option>
                    <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
                    <option value="disetujui">Disetujui</option>
                    <option value="aktif">Aktif</option>
                    <option value="ditolak">Ditolak</option>
                    <option value="selesai_dinilai">Selesai Dinilai</option>
                    <option value="sudah_sertifikat">Sudah Sertifikat</option>
                  </select>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl transition-all cursor-pointer"
                  title="Ekspor ke Excel (CSV)"
                >
                  <FileSpreadsheet size={18} />
                  <span>Excel</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all cursor-pointer"
                  title="Cetak / Ekspor ke PDF"
                >
                  <FileText size={18} />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  Daftar Mahasiswa Magang
                </h2>

                <span className="text-xs text-gray-400 font-medium">
                  {filteredMahasiswa.length} entri {searchTerm || statusFilter ? '(difilter)' : ''}
                </span>
              </div>
              
              <Card>
                <DashboardTable
                  data={filteredMahasiswa}
                  showActions={true}
                  onDelete={handleDelete}
                />

                {filteredMahasiswa.length === 0 && (
                  <div className="p-20 text-center text-gray-400">
                    Tidak ada data mahasiswa ditemukan
                  </div>
                )}
              </Card>
            </div>
          </Card>
        </motion.div>
    </DashboardLayout>
    </>
  )
}