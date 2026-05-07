import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../DashboardLayout'
import api from '../../api/axios'
import { ADMIN_MENU } from '../../constants/adminMenu'
import { formatTanggal } from '../../utils/formatTanggal'
import { styles } from '../../styles/adminStyles'

// ================================================================
// KOMPONEN PEMBANTU
// ================================================================

// Komponen tabel sederhana yang dipakai di dashboard
export default function Table({ data }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            {['Nama','Asal instansi','Periode','Status'].map(h =>
              <th key={h} style={styles.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} style={styles.tr}>
              <td style={styles.td}><strong>{item.nama_lengkap}</strong></td>
              <td style={styles.td}>{item.asal_instansi}</td>
              <td style={styles.td}>{item.tanggal_mulai} – {item.tanggal_selesai}</td>
              <td style={styles.td}><StatusBadge status={item.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}