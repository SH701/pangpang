export async  function logout(){
    const refreshToken = localStorage.getItem('refreshToken');

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    await fetch('/api/auth/logout',{
        method :'POST',
        headers:{"Content-Type":'application/json'},
        body:JSON.stringify({refreshToken})
    }),
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}