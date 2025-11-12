import { useState, useEffect, useRef } from "react";

const DashboardLayout = ({ tabs, fetchData }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]); // default first tab
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchDataRef = useRef(fetchData);

  // Update ref when fetchData changes
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    const loadTabData = async () => {
      setLoading(true);
      try {
        if (fetchDataRef.current && fetchDataRef.current[activeTab]) {
          const result = await fetchDataRef.current[activeTab]();
          setData(result);
        }
      } catch (error) {
        console.error("Error loading tab data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-ff-bg shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {Object.entries(tabs).map(([key, tab]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === key
                    ? "text-ff-accent border-b-2 border-ff-accent"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            tabs[activeTab] && tabs[activeTab].render(data)
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
