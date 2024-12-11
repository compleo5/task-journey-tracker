interface StatsProps {
  total: number;
  new: number;
  inImplementation: number;
  done: number;
}

export const TaskStatistics = ({ total, new: newTasks, inImplementation, done }: StatsProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Total Tickets</h3>
      <p className="text-xl sm:text-2xl font-bold text-primary">{total}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm sm:text-lg font-semibold text-gray-700">New</h3>
      <p className="text-xl sm:text-2xl font-bold text-blue-600">{newTasks}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm sm:text-lg font-semibold text-gray-700">In Implementation</h3>
      <p className="text-xl sm:text-2xl font-bold text-yellow-600">{inImplementation}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Done</h3>
      <p className="text-xl sm:text-2xl font-bold text-green-600">{done}</p>
    </div>
  </div>
);