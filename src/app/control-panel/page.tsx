import DashboardActivity from '@/components/sections/control-panel/DashboardActivity'
import ChartActivity from '@/components/sections/control-panel/ChartActivity'
import RecentUsers from '@/components/sections/control-panel/RecentUsers'
import UserLastEntryLineChart from '@/components/sections/control-panel/UserLastEntryLineChart'
import RadarChart from '@/components/sections/control-panel/RadarChart'
import UsersTable from '@/components/sections/control-panel/UsersTable'

const UsersControl = () => {
  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-16 lg:max-w-screen-xl lg:mx-auto">
      <h1 className="text-primaryOrange font-semibold text-4xl">
        Painel de Controle
      </h1>

      <div className="flex flex-col md:flex-row gap-20">
        <DashboardActivity />
        <ChartActivity />
      </div>

      <RecentUsers />

      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <div className="w-full md:w-auto flex-grow text-center">
            <UserLastEntryLineChart />
          </div>
          <div className="w-full md:w-auto text-center">
            <RadarChart />
          </div>
        </div>
      </div>

      <UsersTable />
    </div>
  )
}

export default UsersControl
