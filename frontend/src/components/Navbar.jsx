import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="navbar  bg-gray-900 shadow-sm text-gray-200 font-bold sticky top-0 z-50">
      <div className="flex-1">
        <h1 className="pl-4 text-[20px]">Travel Planner</h1>

      </div>
      <div className="flex-none px-3">
        <ul className="menu menu-horizontal text-[15px] px-2">
          <li className="hover:bg-blue-800 hover:text-maize rounded transition-colors">
            <Link to='/' className="hover:text-maize">Home</Link>
          </li>
          <li className="hover:bg-blue-800 hover:text-maize rounded transition-colors">
            <Link to='/Destination' className="hover:text-maize">Destination Finder</Link>
          </li>
          <li className="hover:bg-blue-800 hover:text-maize rounded transition-colors">
            <Link to='/Itinerary/' className="hover:text-maize">Itinerary Planner</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
