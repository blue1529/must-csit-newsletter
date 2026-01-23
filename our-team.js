// our-team.js - Complete working version
import { supabase } from './supabaseClient.js';

// Security functions
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return text.replace(/[&<>"'/]/g, m => map[m]);
}

function isValidUrl(string) {
  if (!string || typeof string !== 'string') return false;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function getSafeImageUrl(url) {
  if (!isValidUrl(url)) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  }
  return url;
}

function getCardLink(member) {
  if (isValidUrl(member.profile_url)) {
    return escapeHtml(member.profile_url);
  }
  if (isValidUrl(member.linkedin_url)) {
    return escapeHtml(member.linkedin_url);
  }
  return '#';
}

// Add animation styles to document
function addAnimationStyles() {
  if (!document.getElementById('team-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'team-animation-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
}

// Create team card HTML
function createTeamCard(member, index) {
  const safeName = escapeHtml(member.name || 'Team Member');
  const safePosition = escapeHtml(member.position || 'Member');
  const safeImage = getSafeImageUrl(member.image_url);
  const cardLink = getCardLink(member);
  const safeLinkedin = escapeHtml(member.linkedin_url || '#');
  
  return `
    <div class="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeIn" 
         style="animation-delay: ${index * 100}ms">
      <!-- Entire card is clickable -->
      <a href="${cardLink}" 
         ${cardLink !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}
         class="absolute inset-0 z-10 cursor-pointer">
        <span class="sr-only">View ${safeName}'s profile</span>
      </a>
      
      <!-- Card Background Glow -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
      
      <!-- Profile Image -->
      <div class="relative pt-8 px-6 flex justify-center">
        <div class="relative w-40 h-40">
          <!-- Outer Glow -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
          
          <!-- Image Container -->
          <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            <img 
              src="${safeImage}" 
              alt="${safeName}" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'"
            >
          </div>
          
          <!-- LinkedIn Badge -->
          <a 
            href="${safeLinkedin}" 
            ${safeLinkedin !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}
            onclick="event.stopPropagation();"
            class="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 z-20"
            aria-label="${safeName}'s LinkedIn profile"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <!-- Card Content -->
      <div class="py-6 px-6 text-center">
        <!-- Name -->
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1">
          ${safeName}
        </h3>
        
        <!-- Position with Animated Underline -->
        <div class="relative inline-block mb-4">
          <p class="text-blue-600 dark:text-blue-400 font-medium">${safePosition}</p>
          <div class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
        </div>
        
        <!-- Card Click Hint -->
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click anywhere to view profile
        </div>
      </div>
    </div>
  `;
}

// Main function to load team members
async function loadTeamMembers() {
  console.log('🚀 Loading team members from Supabase...');
  
  const loadingEl = document.getElementById('team-loading');
  const teamList = document.getElementById('team-list');
  const errorEl = document.getElementById('team-error');
  
  if (!teamList || !loadingEl) {
    console.error('❌ Required elements not found');
    return;
  }
  
  // Show loading, hide others
  loadingEl.classList.remove('hidden');
  teamList.classList.add('opacity-0');
  errorEl?.classList.add('hidden');
  
  try {
    // Fetch active team members
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    console.log('📊 Team members response:', { count: data?.length, error });

    // Hide loading
    loadingEl.classList.add('hidden');
    
    if (error) {
      console.error('❌ Error loading team members:', error);
      if (errorEl) {
        errorEl.classList.remove('hidden');
        // Attach retry button event
        const retryBtn = errorEl.querySelector('button');
        if (retryBtn) {
          retryBtn.onclick = loadTeamMembers;
        }
      }
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No team members found');
      teamList.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-gray-500 text-lg mb-4">No team members found</div>
          <p class="text-gray-400">Check back soon for team updates.</p>
        </div>
      `;
      teamList.classList.remove('opacity-0');
      return;
    }

    // Clear and populate team list
    teamList.innerHTML = '';
    addAnimationStyles();
    
    data.forEach((member, index) => {
      const card = createTeamCard(member, index);
      teamList.insertAdjacentHTML('beforeend', card);
    });
    
    // Show with fade in
    setTimeout(() => {
      teamList.classList.remove('opacity-0');
    }, 100);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    loadingEl.classList.add('hidden');
    if (errorEl) {
      errorEl.classList.remove('hidden');
    }
  }
}

// Export the function
export { loadTeamMembers };

// Auto-run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM loaded, initializing team section...');
  loadTeamMembers();
});

// Make it available globally for retry button
window.loadTeamMembers = loadTeamMembers;
/*
INSERT INTO team_members (name, position, image_url, linkedin_url, profile_url, display_order)
VALUES 
('New Member', 'Position', 'image_url', 'linkedin_url', 'profile_url', 5);
*/