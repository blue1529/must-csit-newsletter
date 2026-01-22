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

// Simple HTML sanitizer for description (allows basic formatting)
function sanitizeDescription(html) {
  if (!html || typeof html !== 'string') return '';
  
  // Simple sanitization - remove script tags and other dangerous elements
  let safeHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<link\b[^<]*(?:(?!>)<[^<]*)*>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
  
  return safeHtml;
}

function safeDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date TBD';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Date TBD';
  }
}

async function loadUpcomingEvents() {
  console.log('Loading upcoming events...');
  
  const container = document.getElementById('events-list');
  if (!container) {
    console.error('Events container not found');
    return;
  }
  
  container.innerHTML = '<div class="text-center py-8 text-gray-500">Loading events...</div>';
  
  try {
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .order('date', { ascending: true });

    console.log('Upcoming events response:', { data: data?.length, error });

    container.innerHTML = '';

    if (error) {
      console.error('Error loading events:', error);
      container.innerHTML = '<div class="text-center py-8 text-red-500">Failed to load events</div>';
      return;
    }

    if (!data || data.length === 0) {
      console.log('No events found.');
      container.innerHTML = '<div class="text-center py-8 text-gray-500">No upcoming events available.</div>';
      return;
    }

    data.forEach(event => {
      const safeTitle = escapeHtml(event.title || 'Untitled Event');
      const safeDescription = sanitizeDescription(event.description || '');
      const formattedDate = safeDate(event.date);
      
      // Simple image handling - only show if URL looks valid
      let imageHTML = '';
      if (event.image && event.image.startsWith('http')) {
        imageHTML = `
          <div class="mb-4">
            <img src="${escapeHtml(event.image)}" 
                 alt="${safeTitle}" 
                 class="w-full h-48 object-cover rounded-lg"
                 onerror="this.style.display='none'">
          </div>
        `;
      }

      const card = `
        <div class="bg-blue-50 border border-blue-100 rounded-lg shadow hover:shadow-md transition p-6 mb-6">
          ${imageHTML}
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-semibold text-blue-900">${safeTitle}</h3>
            <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">📅 Event</span>
          </div>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span class="mr-4">📅 ${formattedDate}</span>
            <span class="text-green-600">⏰ Coming Soon</span>
          </div>
          <div class="text-gray-700 leading-relaxed mb-4">${safeDescription}</div>
          <div class="pt-4 border-t border-blue-100">
            <span class="text-sm text-blue-600">🔵 Upcoming Event</span>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', card);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    const container = document.getElementById('events-list');
    if (container) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">Error loading events</div>';
    }
  }
}

async function loadActivities() {
  console.log('Loading activities...');
  
  const container = document.getElementById('activities-list');
  if (!container) {
    console.error('Activities container not found');
    return;
  }
  
  container.innerHTML = '<div class="text-center py-8 text-gray-500">Loading activities...</div>';
  
  try {
    const { data, error } = await supabase
      .from('recent_activities')
      .select('*')
      .order('date', { ascending: false });

    console.log('Activities response:', { data: data?.length, error });

    container.innerHTML = '';

    if (error) {
      console.error('Error loading activities:', error);
      container.innerHTML = '<div class="text-center py-8 text-red-500">Failed to load activities</div>';
      return;
    }

    if (!data || data.length === 0) {
      console.log('No activities found.');
      container.innerHTML = '<div class="text-center py-8 text-gray-500">No recent activities available.</div>';
      return;
    }

    data.forEach((activity, index) => {
      const safeTitle = escapeHtml(activity.title || 'Activity');
      const safeDescription = sanitizeDescription(activity.description || '');
      const formattedDate = safeDate(activity.date);
      
      // Simple color rotation for variety
      const colors = ['green', 'blue', 'purple', 'amber', 'rose', 'cyan'];
      const color = colors[index % colors.length];
      const colorClasses = {
        'green': { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600' },
        'blue': { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
        'purple': { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' },
        'amber': { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
        'rose': { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600' },
        'cyan': { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600' }
      };
      
      const colorSet = colorClasses[color];

      // Calculate how many days ago
      let daysAgo = 'Recently';
      try {
        const activityDate = new Date(activity.date);
        const today = new Date();
        const diffTime = Math.abs(today - activityDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) daysAgo = 'Today';
        else if (diffDays === 1) daysAgo = 'Yesterday';
        else if (diffDays < 7) daysAgo = `${diffDays} days ago`;
        else if (diffDays < 30) daysAgo = `${Math.floor(diffDays / 7)} weeks ago`;
        else daysAgo = `${Math.floor(diffDays / 30)} months ago`;
      } catch {}

      const card = `
        <div class="${colorSet.bg} border-r-blue-700 border-r-5 shadow hover:shadow-md transition p-6 mb-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
              <span class="text-xl mr-2 ${colorSet.text}">📝</span>
              <span class="text-sm ${colorSet.text} font-medium">${daysAgo}</span>
            </div>
            <span class="text-sm ${colorSet.text} px-2 py-1 rounded}">
              ✅ Completed
            </span>
          </div>
          <!-- Title -->
          <h3 class="text-xl font-semibold text-gray-900 mb-2">${safeTitle}</h3>
          <!-- Date -->
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span class="mr-4">📅 ${formattedDate}</span>
          </div>
          
          <div class="text-gray-700 leading-relaxed mb-6">${safeDescription}</div>
          
          <div class="pt-4 border-t ${colorSet.border} text-sm text-gray-500">
            <span>🏷️ Activity • 📍 Completed</span>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', card);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    const container = document.getElementById('activities-list');
    if (container) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">Error loading activities</div>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, loading events and activities...');
  loadUpcomingEvents();
  loadActivities();
});