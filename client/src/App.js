import './App.css';
import Graph from './components/Graph';
import Form from './components/Form';
import backgroundImage from './images/calm.png'; // Import the image

function App() {
  return (
    <div className="bg-cover bg-center bg-fixed h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Background image container */}
      <div className="h-full flex flex-col justify-center">
        {/* Content */}
        <div className="container mx-auto max-w-6xl text-center drop-shadow-lg text-gray-800">
          {/* Header */}
          <h1 className="text-4xl py-8 mb-10 bg-slate-800 text-white rounded">Expense Tracker</h1>

          {/* Grid columns */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Chart */}
            <Graph />
            {/* Form */}
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
