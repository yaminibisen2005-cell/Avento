/**
 * Google Identity Services (GSI) OAuth 2.0 Integration for AVENTO
 */

export const loadGoogleGsi = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve(window.google);
      return;
    }
    const existing = document.getElementById('google-gsi-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
};

/**
 * Initiates Google OAuth popup and retrieves user profile details
 * @param {string} clientId 
 * @returns {Promise<{accessToken: string, userInfo: {id: string, email: string, name: string, picture: string}}>}
 */
export const promptGoogleSignIn = (clientId) => {
  return new Promise((resolve, reject) => {
    loadGoogleGsi().then((google) => {

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }

          try {
            // Fetch Google userinfo using the access token
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
              }
            });

            if (!res.ok) {
              throw new Error('Failed to retrieve user profile from Google');
            }

            const data = await res.json();
            resolve({
              accessToken: tokenResponse.access_token,
              userInfo: {
                id: data.sub,
                email: data.email,
                name: data.name || data.email?.split('@')[0],
                picture: data.picture
              }
            });
          } catch (fetchErr) {
            reject(fetchErr);
          }
        },
        error_callback: (error) => {
          reject(new Error(error.message || 'Google sign-in was closed or cancelled'));
        }
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    }).catch(reject);
  });
};
