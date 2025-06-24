// export async function fetchBinance() {
//   const res = await fetch('https://api.binance.com/api/v3/ticker/price');
//   return res.json();
// }

// export async function fetchCoinbase() {
//   const res = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
//   return res.json();
// }


export async function fetchMarketData(symbol = 'BTC') {
  const res = await fetch(`http://localhost:8999/api/market/${symbol}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }
  return res.json();
}

export async function fetchAlerts(token: string) {
  const res = await fetch('http://localhost:9999/alerts', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur lors de la récupération des alertes');
  return res.json();
}

export async function addAlert(alert: {
  userEmail: string;
  cryptoSymbol: string;
  targetPrice: number;
  condition: string;
}, token: string) {
  const res = await fetch('http://localhost:9999/alerts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alert),
  });
  if (!res.ok) throw new Error('Erreur lors de l\'ajout de l\'alerte');
  // Si le backend ne retourne pas de JSON, retourne null
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function deleteAlert(alertId: number, token: string) {
  const res = await fetch(`http://localhost:9999/alerts/${alertId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'alerte");
  return true;
}

// Ajoute d’autres services ici
