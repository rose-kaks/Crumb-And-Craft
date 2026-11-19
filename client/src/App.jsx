import { useEffect, useState } from 'react';
import axios from 'axios';
export default function App() {
const [serverStatus, setServerStatus] = useState('Checking API...');
useEffect(() => {
axios.get('http://localhost:5000/api/health')
.then((res) => setServerStatus(`${res.data.service}: ${res.data.status}`))
.catch(() => setServerStatus('Backend unreachable'));
}, []);
return (
<main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
<h1>Crumb &amp; Craft — Custom Cake Pre-Order Store</h1>
<p>System Status: <strong>{serverStatus}</strong></p>
</main>
);
}