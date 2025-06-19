import { Link } from 'react-router';
import Chat from '../components/Chat';

function Home() {
  const initialMessage =
    "Hello! I'm DestinationAgent, your travel specialist. I can provide cultural insights, safety tips, and local customs for select European destinations. Ask me about the UK, Norway, Croatia, Italy, Malta, Spain, Portugal, Austria, Belgium, France, Germany, Liechtenstein, Luxembourg, Netherlands, Monaco, or Switzerland!";

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3">
          <h1 className="text-3xl font-bold mb-4">Get Travel Advice!</h1>
          <p className="text-lg mb-4">
            Want to go travel but don't want to do all the homework? 
            Have a destination in mind but don't know how to start planning?
            This website has AI agents that help you do that!
          </p>
          <p className="text-gray-700">
            Feel free to interact with the DestinationAgent to get information about each european destination. 
          </p>
        </div>
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h5 className="text-xl font-semibold mb-2">
                Chat with DestinationAgent
              </h5>
              <p className="text-gray-600 mb-4">
                Get travel advice, cultural tips, and safety info for select European destinations.
              </p>
              <Chat
                agentType="destination"
                initialMessage={initialMessage}
                agentInitials="DA"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Meet the Agents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="p-6 flex flex-col items-center">
              <div className="agent-avatar-placeholder mb-4">PA</div>
              <h5 className="text-xl font-semibold mb-2">ProjectAgent</h5>
              <p className="text-gray-600 mb-4 text-center">
                Provides detailed information about my projects, technologies
                used, and challenges overcome.
              </p>
              <Link
                to="/projects"
                className="mt-auto py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Projects
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="p-6 flex flex-col items-center">
              <div className="agent-avatar-placeholder mb-4">CA</div>
              <h5 className="text-xl font-semibold mb-2">CareerAgent</h5>
              <p className="text-gray-600 mb-4 text-center">
                Shares information about my skills, experience, and professional
                background.
              </p>
              <Link
                to="/career"
                className="mt-auto py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Career
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="p-6 flex flex-col items-center">
              <div className="agent-avatar-placeholder mb-4">BA</div>
              <h5 className="text-xl font-semibold mb-2">BusinessAdvisor</h5>
              <p className="text-gray-600 mb-4 text-center">
                Provides information about services, pricing, and client
                engagement process.
              </p>
              <Link
                to="/services"
                className="mt-auto py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="p-6">
            <h5 className="text-xl font-semibold mb-2">Featured Projects</h5>
            <p className="text-gray-600 mb-4">
              Check out some of my recent work:
            </p>
            <ul className="divide-y divide-gray-200">
              <li className="py-3 px-2">E-commerce Platform</li>
              <li className="py-3 px-2">Task Management Application</li>
              <li className="py-3 px-2">Data Visualization Dashboard</li>
            </ul>
            <div className="mt-4">
              <Link
                to="/projects"
                className="inline-block py-1.5 px-3 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="p-6">
            <h5 className="text-xl font-semibold mb-2">Research & Insights</h5>
            <p className="text-gray-600 mb-4">
              Explore my research on emerging technologies and industry trends:
            </p>
            <ul className="divide-y divide-gray-200">
              <li className="py-3 px-2">AI in Web Development</li>
              <li className="py-3 px-2">Modern Frontend Frameworks</li>
              <li className="py-3 px-2">Cloud Architecture Patterns</li>
            </ul>
            <div className="mt-4">
              <Link
                to="/research"
                className="inline-block py-1.5 px-3 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;