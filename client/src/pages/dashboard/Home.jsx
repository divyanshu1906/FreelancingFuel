const Home = () => {
  const recentProjects = [
    { id: 1, title: "Website Redesign", budget: 1200, status: "In Progress" },
    { id: 2, title: "Landing Page Dev", budget: 500, status: "Open" },
    { id: 3, title: "API Integration", budget: 800, status: "Completed" },
  ];

  const recentApplications = [
    { id: 1, project: "Website Redesign", freelancer: "Alex J.", date: "2 days ago", status: "pending" },
    { id: 2, project: "Landing Page Dev", freelancer: "Priya S.", date: "4 days ago", status: "accepted" },
  ];

  const recommended = [
    { id: 1, name: "Alex J.", title: "Frontend Engineer" },
    { id: 2, name: "Priya S.", title: "UI/UX Designer" },
    { id: 3, name: "Mark T.", title: "Fullstack Dev" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-ff-bg rounded-lg p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center mx-auto">
            <h1 className="text-2xl font-bold">Welcome back Satyam 👋</h1>
            <p className="mt-1 text-sm text-ff-accent-dark">Manage your projects, chat with freelancers, and review applications.</p>
          </div>

          
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-1 lg:col-span-2 bg-white p-4 rounded shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Overview</h3>
            <span className="text-xs text-gray-400">Updated just now</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-ff-bg p-3 rounded">
              <div className="text-sm text-ff-accent-dark">Projects</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <div className="bg-ff-bg p-3 rounded">
              <div className="text-sm text-ff-accent-dark">Open</div>
              <div className="text-2xl font-bold">3</div>
            </div>
            <div className="bg-ff-bg p-3 rounded">
              <div className="text-sm text-ff-accent-dark">In Progress</div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="bg-ff-bg p-3 rounded">
              <div className="text-sm text-ff-accent-dark">Pending Apps</div>
              <div className="text-2xl font-bold">4</div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
            <h4 className="font-semibold mb-3">Recent Projects</h4>
            <ul className="space-y-3">
              {recentProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-gray-400">Budget ${p.budget} • {p.status}</div>
                  </div>
                  <div>
                    <button className="text-ff-accent-dark text-sm">Open</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
            <h4 className="font-semibold mb-3">Recent Applications</h4>
            <ul className="space-y-3">
              {recentApplications.map((a) => (
                <li key={a.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.freelancer}</div>
                    <div className="text-xs text-gray-400">{a.project} • {a.date}</div>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded ${a.status === 'accepted' ? 'bg-green-50 text-green-800' : a.status === 'pending' ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>{a.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
        <h4 className="font-semibold mb-3">Recommended Freelancers</h4>
        <div className="flex gap-4">
          {recommended.map((r) => (
            <div key={r.id} className="flex items-center gap-3 bg-ff-bg p-3 rounded w-48">
              <div className="w-10 h-10 rounded-full bg-ff-accent/10 flex items-center justify-center text-ff-accent-dark font-semibold">{r.name.charAt(0)}</div>
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-gray-400">{r.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
