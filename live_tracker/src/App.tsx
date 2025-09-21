// In App.tsx
import MapView from './components/MapView';
import SOSButton from './components/SOSButton'; // Import it

function App() {
  return (
    <div>
      <MapView />
      <SOSButton /> {/* Add it here */}
    </div>
  );
}

export default App;