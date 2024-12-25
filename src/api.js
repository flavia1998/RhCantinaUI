export async function fetchWithAuth(url, options = {}) {
    const user = localStorage.getItem('user');
    if (user) {
        const { token: token } = JSON.parse(user);
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    return response;
}

export async function getEmployeeByNif(nif){
    const employeeResponse = await fetchWithAuth(`http://localhost:8080/api/employee/${nif}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!employeeResponse.ok) {
        throw new Error('Failed to fetch employee details');
      }

      return await employeeResponse.json();
}