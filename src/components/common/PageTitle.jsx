import { Helmet } from 'react-helmet-async'

export default function PageTitle({
  title,
  appName = 'SIM Magang Dispusip Riau',
}) {
  return (
    <Helmet>
      <title>
        {title
          ? `${title} | ${appName}`
          : appName}
      </title>
    </Helmet>
  )
}