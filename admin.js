// Authentication Configuration
    const AUTH_CONFIG = {
      username: 'admin',
      password: 'aegis@123'
    };

    const ROUND_SECONDS = 45;
    const WINNER_SCORE = 15;
    let timeLeft = ROUND_SECONDS;
    let isAuthenticated = false;
    let _uid = null;
    let timer = null;
    let leaderboardChannel = null;
    let currentLeaderboard = [];

    const landmarksConfig = [
        {
            "name": "Taj Mahal",
            "latitude": 27.175048,
            "longitude": 78.0420336,
            "image_name": "tajmahal.jpg"
        },
        {
            "name": "Qutub Minar",
            "latitude": 28.524428,
            "longitude": 77.185455,
            "image_name": "qutub_minar.jpg"
        },
        {
            "name": "Gateway of India",
            "latitude": 18.921984,
            "longitude": 72.834654,
            "image_name": "gateway_of_india.jpg"
        },
        {
            "name": "India Gate",
            "latitude": 28.612864,
            "longitude": 77.229455,
            "image_name": "India_date.jpg"
        },
        {
            "name": "Charminar",
            "latitude": 17.361564,
            "longitude": 78.474728,
            "image_name": "charminar.jpg"
        },
        {
            "name": "Agra Fort",
            "latitude": 27.179533,
            "longitude": 78.021114,
            "image_name": "agra_fort.jpg"
        },
        {
            "name": "Ajanta Caves",
            "latitude": 20.551861,
            "longitude": 75.703274,
            "image_name": "ajanta_caves.jpg"
        },
        {
            "name": "Mehrangarh Fort",
            "latitude": 26.2981858,
            "longitude": 72.9825211,
            "image_name": "mehrangarh_fort.jpg"
        },
        {
            "name": "Victoria Memorial",
            "latitude": 22.5448081,
            "longitude": 88.3403054,
            "image_name": "victoria_memorial.jpg"
        },
        {
            "name": "Golconda Fort",
            "latitude": 17.3833142,
            "longitude": 78.3984773,
            "image_name": "golconda_fort.jpg"
        },
        {
            "name": "Sun Temple Konark",
            "latitude": 19.8875953,
            "longitude": 85.8906131,
            "image_name": "sun_temple_konark.jpg"
        },
        {
            "name": "Mysore Palace",
            "latitude": 12.3051682,
            "longitude": 76.6526,
            "image_name": "mysore_palace.jpg"
        },
        {
            "name": "Chittorgarh Fort",
            "latitude": 24.8841949,
            "longitude": 74.6419264,
            "image_name": "chittorgarh_fort.jpg"
        },
        {
            "name": "Humayun’s Tomb",
            "latitude": 28.5935932,
            "longitude": 77.2477279,
            "image_name": "humayuns_tomb.jpg"
        },
        {
            "name": "CIEC",
            "latitude": 12.9471203,
            "longitude": 80.2291015,
            "image_name": "ciec.jpg"
        },
        {
            "name": "College of Engineering, Guindy",
            "latitude": 13.0109452,
            "longitude": 80.2328713,
            "image_name": "ceg.jpg"
        },
        {
            "name": "Jatayu Earth's Center",
            "latitude": 8.8608351,
            "longitude": 76.8657479,
            "image_name": "jatayu.jpg"
        },
        {
            "name": "Brihadeeswara Temple",
            "latitude": 10.7829727,
            "longitude": 79.1318679,
            "image_name": "brihadeeswara_temple.jpg"
        },
        {
            "name": "Howrah Bridge",
            "latitude": 22.5850482,
            "longitude": 88.3418149,
            "image_name": "howrah_bridge.jpg"
        },
        {
            "name": "Thiruvalluvar Statue",
            "latitude": 8.0778282,
            "longitude": 77.5355816,
            "image_name": "thiruvallur_statue.jpg"
        },
        {
            "name": "Statue Of Unity",
            "latitude": 21.8381696,
            "longitude": 73.7188833,
            "image_name": "status_of_unity.jpg"
        },
        {
            "name": "Buddha Statue",
            "latitude": 17.4155708,
            "longitude": 78.4723981,
            "image_name": "buddha_statue.jpg"
        },
        {
            "name": "Narendra Modi Stadium",
            "latitude": 22.0927764,
            "longitude": 68.98892,
            "image_name": "modi_stadium.jpg"
        },
        {
            "name": "Hawa Mahal",
            "latitude": 26.9239122,
            "longitude": 75.8263708,
            "image_name": "hawa_mahal.jpg"
        },
        {
            "name": "Comcast Technology Center",
            "latitude": 39.9548621,
            "longitude": -75.3144286,
            "image_name": "ctc.jpg"
        },
        {
            "name": "Statue of Liberty",
            "latitude": 40.6892534,
            "longitude": -74.0470753,
            "image_name": "statue_of_liberty.jpg"
        },
        {
            "name": "Mahabalipuram Shore Temple",
            "latitude": 12.6164718,
            "longitude": 80.180878,
            "image_name": "shore_temple.jpg"
        }
    ];

    const SUPABASE_API = 'https://yyfsstbxznagvlejrvij.supabase.co';
    const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZnNzdGJ4em5hZ3ZsZWpydmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTY4NTIsImV4cCI6MjA3OTM3Mjg1Mn0.NIxlUkHNM7caJKfGXRim31yhWxwqWWFfh1oGT6PTBI8';
    const supabase = window.supabase.createClient(SUPABASE_API, API_KEY);

    // DOM Elements - Login
    const loginContainer = document.getElementById('loginContainer');
    const adminContent = document.getElementById('adminContent');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const loginError = document.getElementById('loginError');
    const logoutButton = document.getElementById('logoutButton');

    // DOM Elements - Admin Panel
    const mainImage = document.getElementById('mainImage');
    const placeholder = document.getElementById('placeholder');
    const refreshButton = document.getElementById('refreshButton');
    const statusIndicator = document.getElementById('statusIndicator');
    const loadingOverlay = document.getElementById('loadingOverlay');      const titleEl = document.getElementById('landmarkTitle');
    const timerFill = document.getElementById('timerFill');
    const leaderboardToast = document.getElementById('leaderboardToast');
    const leaderboardContent = document.getElementById('leaderboardContent');

    // Authentication Functions
    function showLoginError(message) {
      loginError.textContent = message;
      loginError.classList.add('show');
      setTimeout(() => {
        loginError.classList.remove('show');
      }, 5000);
    }

    function authenticate(username, password) {
      return username === AUTH_CONFIG.username && password === AUTH_CONFIG.password;
    }    function showAdminPanel() {
      loginContainer.style.display = 'none';
      adminContent.classList.add('authenticated');
      isAuthenticated = true;
      
      // Initialize the admin panel
      fetchLandmarkData();
      // Initialize leaderboard subscription
      initLeaderboard();
      // Show success notification
      // showNotification('Login successful! Welcome to the admin panel.', 'success');
    }

    function showLoginScreen() {
      loginContainer.style.display = 'flex';
      adminContent.classList.remove('authenticated');
      isAuthenticated = false;
      
      // Clear form
      usernameInput.value = '';
      passwordInput.value = '';
      loginError.classList.remove('show');
    }

    function handleLogin(event) {
      event.preventDefault();
      
      // const username = usernameInput.value.trim();
      // const password = passwordInput.value.trim();
      const username = "admin";
      const password = "aegis@123"
      
      // Show loading state
      loginButton.loading = true;
      loginButton.disabled = true;
      
      // Simulate authentication delay
      setTimeout(() => {
        if (authenticate(username, password)) {
          showAdminPanel();
        } else {
          showLoginError('Invalid username or password. Please try again.');
        }
        
        loginButton.loading = false;
        loginButton.disabled = false;
      }, 1000);
    }

    // Show loading state
    function showLoading() {
      loadingOverlay.classList.add('active');
      refreshButton.disabled = true;
    }

    // Hide loading state
    function hideLoading() {
      loadingOverlay.classList.remove('active');
      refreshButton.disabled = false;
    }    

    async function deletePlayerSubmissions () {
        const { data, error } = await supabase
        .from('player_submissions')
        .delete()
        .neq('id', 0); // Delete all records except where id is 0 (if any)
        console.log(data)
    }

    async function refreshImage() {
      try {
        showLoading();
        await deletePlayerSubmissions();
        let { name, latitude, longitude, image_name} = getRandomRecord();
        
        const { data, error } = await supabase
        .from('active_landmark')
        .upsert([{
            id: 1,
            name: name,
            latitude: latitude,
            longitude: longitude,
            image_name: image_name,
            created_time: Date.now(),
            uid: crypto.randomUUID()
          }])
        .select("*");
          
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        const record = data[0];
        localStorage.setItem(record?.uid, JSON.stringify(record));

        _uid = record?.uid;
        startTimer();
        // Reset leaderboard for new landmark
        resetLeaderboard();

        const imageUrl = `${window.location.origin}/images/${record.image_name}`;
        
        titleEl.textContent = record.name;
        mainImage.src = imageUrl;
        mainImage.style.display = 'block';
        hideLoading();
      } catch (error) {
        console.error('Error refreshing image:', error);
        hideLoading();
        showNotification('Failed to refresh image', 'error');
      }    
    }

    async function fetchLandmarkData() {
      try {
        console.log('Fetching landmark data...');
        const { data, error } = await supabase
          .from('active_landmark')
          .select("*");
          
        if (error) {
          console.error('Supabase fetch error:', error);
          throw error;
        }
        
        const record = data[0];
        localStorage.setItem(record?.uid, JSON.stringify(record));
        _uid = record?.uid;
        startTimer();
        const imageUrl = `${window.location.origin}/images/${record.image_name}`;

        titleEl.textContent = record.name;
        mainImage.src = imageUrl;
        mainImage.style.display = 'block';
        placeholder.style.display = 'none';
        hideLoading();
      } catch (error) {
        console.error('Error fetching landmark data:', error);
        hideLoading();
        showNotification('Failed to load landmark data', 'error');
      }
    }

    const getRandomRecord = () => {
      let randomIndex = Math.floor(Math.random() * landmarksConfig.length);
      let storedData = localStorage.getItem('completedIndices');
      let completedIndices = JSON.parse(storedData) || [];
      completedIndices = new Set(completedIndices);
      completedIndices = [...completedIndices];
      if (completedIndices.length >= landmarksConfig.length) {
        completedIndices = [];
        localStorage.setItem('completedIndices', JSON.stringify([]));
        // console.log('Resetting completed indices');
      }
      if (completedIndices.indexOf(randomIndex) != -1) {
        while (completedIndices.indexOf(randomIndex) != -1) {
          randomIndex = Math.floor(Math.random() * landmarksConfig.length);
        }
      }
      // console.log(randomIndex)
      localStorage.setItem('completedIndices', JSON.stringify([...completedIndices, randomIndex]));
      return landmarksConfig[randomIndex];
    }

    // Timer mechanics
    const startTimer = () =>{ 
      stopTimer();
      let currentTime = Date.now();
      let startTime = new Date(JSON.parse(localStorage.getItem(_uid))?.created_time);
      let timeDifference = Math.ceil((currentTime - startTime)/1000);
      timeLeft = ROUND_SECONDS - timeDifference;
      // console.log('Time Difference ', timeLeft);
      if (timeDifference >= ROUND_SECONDS) {
        return;
      } 
      timerFill.style.width = '100%';
      timer = setInterval(()=>{
        timeLeft--;
        const pct = (timeLeft/ROUND_SECONDS)*100; 
        timerFill.style.width = pct + '%';
        // console.log(`${timeLeft} seconds left, ${pct}% remaining`);
        if (timeLeft <= 0) { 
          stopTimer();
        }
      },1000);
    }

    const stopTimer = () => { 
      if (timer) clearInterval(timer); 
    }    // Show notification toast
    function showNotification(message, type) {
      // Create a temporary toast notification
      const toast = document.createElement('calcite-alert');
      toast.setAttribute('open', '');
      toast.setAttribute('auto-close', '');
      toast.setAttribute('auto-close-duration', 'fast');
      toast.setAttribute('kind', type === 'error' ? 'danger' : 'success');
      
      const alertMessage = document.createElement('div');
      alertMessage.setAttribute('slot', 'message');
      alertMessage.textContent = message;
      
      toast.appendChild(alertMessage);
      document.body.appendChild(toast);
      
      // Remove toast after it closes
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    }    // ===== LEADERBOARD FUNCTIONS =====

    // Initialize leaderboard with real-time subscription
    async function initLeaderboard() {
      try {
        // Show leaderboard toast
        leaderboardToast.classList.add('visible');

        // Subscribe to player_submissions table for real-time updates
        leaderboardChannel = supabase
          .channel('player_submissions_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'player_submissions'
            },
            (payload) => {
              console.log('Leaderboard update received:', payload);
              // Refresh leaderboard when new submission arrives
              fetchLeaderboard();
            }
          )
          .subscribe();

        // Initial fetch
        await fetchLeaderboard();
      } catch (error) {
        console.error('Error initializing leaderboard:', error);
      }
    }    // Fetch and update leaderboard
    async function fetchLeaderboard() {
      if (!_uid) {
        console.log('No active landmark UID');
        return;
      }

      try {
        // Fetch submissions for current landmark - already has computed values!
        const { data: submissions, error } = await supabase
          .from('player_submissions')
          .select('*')
          .eq('landmark_uid', _uid)
          .order('score', { ascending: true })  // Sort by pre-calculated score
          .limit(5);  // Only fetch top 3 - more efficient!

        if (error) {
          console.error('Error fetching submissions:', error);
          return;
        }

        if (!submissions || submissions.length === 0) {
          updateLeaderboardUI([]);
          return;
        }

        // No calculations needed - data is already optimized!
        const topPlayers = submissions.map(sub => ({
          ...sub,
          distance: sub.distance_km,
          timeTaken: sub.time_taken_seconds,
          score: sub.score
        }));

        currentLeaderboard = topPlayers;
        updateLeaderboardUI(topPlayers);

      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    }

    // Update leaderboard UI
    function updateLeaderboardUI(topPlayers) {
      if (topPlayers.length === 0) {
        leaderboardContent.innerHTML = `
          <div class="leaderboard-empty">
            <calcite-icon icon="users" scale="m"></calcite-icon>
            <span>Waiting for players...</span>
          </div>
        `;
        return;
      }

      const rankColors = ['#FFD700', '#C0C0C0'];

      leaderboardContent.innerHTML = topPlayers.map((player, index) => `
        <div class="leaderboard-item" style="border-left: 3px solid ${(index == 0 && player.score.toFixed(2) <= WINNER_SCORE) ? rankColors[0] : rankColors[1]}">
          <div class="player-rank">${(index == 0 && player.score.toFixed(2) <= WINNER_SCORE) ? '🥇' : ''}</div>
          <div class="player-info">
            <div class="player-name">${player.player_name || 'Anonymous'}</div>
            <div class="player-stats">
              <span class="stat">
                <calcite-icon icon="measure" scale="s"></calcite-icon>
                ${player.distance.toFixed(2)} km
              </span>
              <span class="stat">
                <calcite-icon icon="clock" scale="s"></calcite-icon>
                ${player.timeTaken}s
              </span>
            </div>
          </div>
          <div class="player-score">${player.score.toFixed(2)}</div>
        </div>
      `).join('');
    }

    // Reset leaderboard for new landmark
    function resetLeaderboard() {
      currentLeaderboard = [];
      updateLeaderboardUI([]);
      // Re-subscribe with new landmark
      if (leaderboardChannel) {
        supabase.removeChannel(leaderboardChannel);
      }
      initLeaderboard();
    }

    // Clean up leaderboard subscription
    function cleanupLeaderboard() {
      if (leaderboardChannel) {
        supabase.removeChannel(leaderboardChannel);
        leaderboardChannel = null;
      }
      leaderboardToast.classList.remove('visible');
    }    
    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    refreshButton.addEventListener('click', refreshImage);
    
    // Refresh Leaderboard Button
    const refreshLeaderboardButton = document.getElementById('refreshLeaderboardButton');
    if (refreshLeaderboardButton) {
      refreshLeaderboardButton.addEventListener('click', async () => {
        console.log('Manual leaderboard refresh triggered');
        // Toggle visibility and refresh
        if (leaderboardToast.classList.contains('visible')) {
          leaderboardToast.classList.remove('visible');
        } else {
          leaderboardToast.classList.add('visible');
          await fetchLeaderboard();
        }
      });
    }

    // Handle Enter key in login form
    usernameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        passwordInput.focus();
      }
    });

    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleLogin(e);
      }
    });

    // Initialize the page
    document.addEventListener('DOMContentLoaded', () => {
      showLoginScreen();
    });

    // Handle image load errors gracefully
    mainImage.addEventListener('error', () => {
      placeholder.style.display = 'flex';
      mainImage.style.display = 'none';
    });    let completedIndices = localStorage.getItem('completedIndices');
    if (!completedIndices) {
      localStorage.setItem('completedIndices', JSON.stringify([]));
    }