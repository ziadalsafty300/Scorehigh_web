// Supabase Configuration and Client Wrapper
// To use this, you must include the Supabase JS script in your HTML before this file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://fkhrdbodwluyaemxlrtb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OV4MnThYCAYcrkwkyhEMyg_oy3J9d9A';

// Initialize the Supabase client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.ScoreHighAuth = {
  checkUser: async () => {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    return session ? session.user : null;
  },

  logout: async () => {
    await window.supabaseClient.auth.signOut();
    window.location.href = 'index.html';
  },

  updateAuthUI: async () => {
    const user = await ScoreHighAuth.checkUser();
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Remove existing auth links if they exist
    document.querySelectorAll('.auth-nav-link').forEach(el => el.remove());

    if (user) {
      // User is logged in
      const dashboardLink = document.createElement('a');
      dashboardLink.href = 'dashboard.html';
      dashboardLink.className = 'nav-link auth-nav-link';
      dashboardLink.innerText = 'Dashboard';

      const logoutBtn = document.createElement('a');
      logoutBtn.href = '#';
      logoutBtn.className = 'nav-link auth-nav-link btn btn-outline';
      logoutBtn.style.padding = '0.5rem 1rem';
      logoutBtn.innerText = 'Log Out';
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        ScoreHighAuth.logout();
      };

      navLinks.appendChild(dashboardLink);
      navLinks.appendChild(logoutBtn);
    } else {
      // User is logged out
      const loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.className = 'nav-link auth-nav-link';
      loginLink.innerText = 'Log In';

      const signupBtn = document.createElement('a');
      signupBtn.href = 'signup.html';
      signupBtn.className = 'nav-link auth-nav-link btn btn-primary';
      signupBtn.style.padding = '0.5rem 1rem';
      signupBtn.innerText = 'Sign Up';

      navLinks.appendChild(loginLink);
      navLinks.appendChild(signupBtn);
    }
  }
};

// Automatically update UI on loaded pages
document.addEventListener('DOMContentLoaded', () => {
  window.ScoreHighAuth.updateAuthUI();
});
