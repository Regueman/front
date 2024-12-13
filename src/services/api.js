export async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }
  