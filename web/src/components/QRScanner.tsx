import { useState } from 'react';
import { Camera, CheckCircle, XCircle, Search } from 'lucide-react';
import { Link } from './Link';

interface QRScannerProps {
  language: 'es' | 'en';
}

export function QRScanner({ language }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{
    success: boolean;
    name: string;
    ticketType: string;
    eventName: string;
    message: string;
  } | null>(null);

  const [manualCode, setManualCode] = useState('');

  const mockScannedTickets = [
    { id: '1', time: '14:32', name: 'María García', ticketType: 'Grada Media', status: 'valid' },
    { id: '2', time: '14:28', name: 'Juan Pérez', ticketType: 'Pista', status: 'valid' },
    { id: '3', time: '14:25', name: 'Ana Martínez', ticketType: 'FrontStage', status: 'already_used' },
    { id: '4', time: '14:20', name: 'Pedro López', ticketType: 'Grada Superior', status: 'valid' },
  ];

  const translations = {
    es: {
      qrScanner: 'Lector de QR - Acceso',
      backToAdmin: 'Volver al panel',
      startScanning: 'Iniciar escaneo',
      scanning: 'Escaneando...',
      stopScanning: 'Detener',
      manualEntry: 'Entrada manual',
      enterCode: 'Introduce el código',
      verify: 'Verificar',
      validTicket: '✓ Entrada válida',
      invalidTicket: '✗ Entrada no válida',
      alreadyUsed: '✗ Entrada ya utilizada',
      scanHistory: 'Historial de escaneos',
      time: 'Hora',
      name: 'Nombre',
      ticketType: 'Tipo',
      status: 'Estado',
      valid: 'Válida',
      used: 'Ya usada',
      totalScanned: 'Total escaneadas',
      validScans: 'Válidas',
      welcome: 'Bienvenido/a',
      accessGranted: 'Acceso concedido',
    },
    en: {
      qrScanner: 'QR Scanner - Access Control',
      backToAdmin: 'Back to panel',
      startScanning: 'Start scanning',
      scanning: 'Scanning...',
      stopScanning: 'Stop',
      manualEntry: 'Manual entry',
      enterCode: 'Enter code',
      verify: 'Verify',
      validTicket: '✓ Valid ticket',
      invalidTicket: '✗ Invalid ticket',
      alreadyUsed: '✗ Ticket already used',
      scanHistory: 'Scan history',
      time: 'Time',
      name: 'Name',
      ticketType: 'Type',
      status: 'Status',
      valid: 'Valid',
      used: 'Already used',
      totalScanned: 'Total scanned',
      validScans: 'Valid',
      welcome: 'Welcome',
      accessGranted: 'Access granted',
    }
  };

  const t = translations[language];

  const handleScan = () => {
    // Simulate scanning
    setScanning(true);
    setTimeout(() => {
      const isValid = Math.random() > 0.3;
      const alreadyUsed = !isValid && Math.random() > 0.5;
      
      setLastScan({
        success: isValid,
        name: 'María García López',
        ticketType: 'Grada Media',
        eventName: 'Dani Martín - Gira 25 P*t*s Años',
        message: alreadyUsed ? t.alreadyUsed : isValid ? t.validTicket : t.invalidTicket,
      });
      setScanning(false);
    }, 2000);
  };

  const handleManualVerify = () => {
    if (manualCode.length < 5) return;
    
    const isValid = Math.random() > 0.3;
    setLastScan({
      success: isValid,
      name: 'Juan Pérez Sánchez',
      ticketType: 'Pista',
      eventName: 'Dani Martín - Gira 25 P*t*s Años',
      message: isValid ? t.validTicket : t.invalidTicket,
    });
    setManualCode('');
  };

  const validCount = mockScannedTickets.filter(t => t.status === 'valid').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1>{t.qrScanner}</h1>
          <Link href="/admin" className="text-[#00A859] hover:underline">
            {t.backToAdmin}
          </Link>
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Camera View */}
            <div className="w-full max-w-md aspect-square bg-gray-900 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
              {scanning ? (
                <div className="text-white text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                  <p className="text-xl">{t.scanning}</p>
                  <div className="absolute inset-0 border-4 border-[#00A859] animate-pulse" />
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p>{t.startScanning}</p>
                </div>
              )}
            </div>

            {/* Scan Button */}
            <button
              onClick={scanning ? () => setScanning(false) : handleScan}
              className={`w-full max-w-md py-4 rounded-xl text-lg transition-colors ${
                scanning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-[#00A859] hover:bg-[#008A47] text-white'
              }`}
            >
              {scanning ? t.stopScanning : t.startScanning}
            </button>
          </div>

          {/* Last Scan Result */}
          {lastScan && (
            <div
              className={`mt-6 p-6 rounded-xl ${
                lastScan.success
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-red-100 border-2 border-red-500'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                {lastScan.success ? (
                  <CheckCircle className="w-16 h-16 text-green-600" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-600" />
                )}
                <div className="flex-1">
                  <p className={`text-2xl mb-2 ${
                    lastScan.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {lastScan.message}
                  </p>
                  {lastScan.success && (
                    <>
                      <p className="text-xl mb-1">{t.welcome} {lastScan.name}</p>
                      <p className="text-gray-700">{lastScan.ticketType}</p>
                      <p className="text-sm text-gray-600 mt-2">{lastScan.eventName}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manual Entry */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="mb-4">{t.manualEntry}</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t.enterCode}
                className="flex-1 px-4 py-3 border-2 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleManualVerify()}
              />
              <button
                onClick={handleManualVerify}
                className="px-6 py-3 bg-[#00A859] text-white rounded-lg hover:bg-[#008A47] transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {t.verify}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-2">{t.totalScanned}</p>
            <p className="text-4xl text-[#00A859]">{mockScannedTickets.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-2">{t.validScans}</p>
            <p className="text-4xl text-green-600">{validCount}</p>
          </div>
        </div>

        {/* Scan History */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b">
            <h2>{t.scanHistory}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                    {t.time}
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                    {t.name}
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                    {t.ticketType}
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                    {t.status}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockScannedTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket.time}</td>
                    <td className="px-6 py-4">{ticket.name}</td>
                    <td className="px-6 py-4">{ticket.ticketType}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          ticket.status === 'valid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {ticket.status === 'valid' ? t.valid : t.used}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
