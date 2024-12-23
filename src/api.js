export async function fetchWithAuth(url, options = {}) {
    const user = localStorage.getItem('user');
    if (user) {
        const { userToken: userToken } = JSON.parse(user);
        console.log(userToken);
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${userToken}`
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