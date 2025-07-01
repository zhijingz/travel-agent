import { Link } from 'react-router-dom'; 
import Chat from '../components/Chat';

function Destination() {
  const initialMessage =
    "Hello! I'm DestinationAgent, your travel specialist. I can provide cultural insights, safety tips, and local customs for any destination! My expertise is in Europe but ask me about anything!";

  return (
    <div className="bg-gray-900 text-gray-100 px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-16">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-300 mt-10">Chat with Destination Agent!</h1>
          <p className="text-lg text-gray-200">
            Get ideas for travel destinations based on your preferences!
          </p>
        </div>
        <div className="shadow-lg overflow-hidden w-full max-w-2xl">
          <div className="p-6">
            <Chat
              agentType="destination"
              initialMessage={initialMessage}
              agentInitials="DA"
            />
          </div>
        </div>
      

      {/* Meet the Agents Section */}
      <div className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-200">Meet the Agents</h2>
        </div>
        
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
            <div className="p-6 flex flex-col items-center">
              <div className="agent-avatar-placeholder mb-4 bg-pink-700 text-white w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold">DA</div>
              <h5 className="text-xl font-semibold mb-2 text-pink-200">ItineraryAgent</h5>
              <p className="text-gray-400 mb-4 text-center">
                Creates detailed travel plans with daily schedules and recommendations.
              </p>
              <Link
                to="/Destination"
                className="mt-auto py-2 px-4 border border-pink-400 text-pink-400 rounded-md hover:bg-pink-900 transition-colors"
              >
                Plan your trip
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </div>  

  );
}

export default Destination;
