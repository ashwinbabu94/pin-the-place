const SUPABASE_API = 'https://yyfsstbxznagvlejrvij.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZnNzdGJ4em5hZ3ZsZWpydmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTY4NTIsImV4cCI6MjA3OTM3Mjg1Mn0.NIxlUkHNM7caJKfGXRim31yhWxwqWWFfh1oGT6PTBI8';
const supabase = window.supabase.createClient(SUPABASE_API, API_KEY);

  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/geometryEngine",
    "esri/widgets/Home"
  ], function(Map, MapView, SceneView, Graphic, GraphicsLayer, Point, Polyline, geometryEngine, Home) {

    const ROUND_SECONDS = 60;
    const MAX_ATTEMPTS = 2;
    let _uid = null;
    let guessGraphic = null;

    // DOM elements
    const timerFill = document.getElementById('timerFill');    
    const accuracyModal = document.getElementById('accuracyModal');
    const modalDistance = document.getElementById('modalDistance');
    const modalTime = document.getElementById('modalTime');
    const accuracyMessage = document.getElementById('accuracyMessage');
    const timeoverModal = document.getElementById('timeoverModal');
    const maxAttemptModal = document.getElementById('maxAttemptModal');
    const retryBtn = document.getElementById('retryBtn');
      // Name modal elements
    const nameModal = document.getElementById('nameModal');
    const nameInput = document.getElementById('nameInput');
    const saveNameBtn = document.getElementById('saveNameBtn');

    // Check if user name exists in localStorage
    function checkUserName() {
      const userName = localStorage.getItem('pinThePlace_userName');
      if (!userName) {
        // Show name modal if no name is stored
        nameModal.open = true;
      } else {
        // console.log(`Welcome back, ${userName}!`);
        initializeGame();
      }
    }    
    
    // Initialize the game after name is set
    function initializeGame() {
      const userName = localStorage.getItem('pinThePlace_userName');
      
      // Display user name in header
      const userWelcome = document.getElementById('userWelcome');
      const userNameDisplay = document.getElementById('userNameDisplay');
      
      if (userName && userWelcome && userNameDisplay) {
        userNameDisplay.textContent = userName;
        userWelcome.style.display = 'block';
      }
      // Game initialization logic can go here
      getLandmarkInfo();
    }

    // Name input validation
    nameInput.addEventListener('input', function() {
      const name = nameInput.value.trim();
      saveNameBtn.disabled = name.length === 0;
      
      // Clear any validation state
      if (name.length > 0) {
        nameInput.status = 'valid';
      } else {
        nameInput.status = 'invalid';
      }
    });

    // Handle name input on Enter key
    nameInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !saveNameBtn.disabled) {
        saveUserName();
      }
    });

    async function getLandmarkInfo (liveData) {
      try {

        if (!liveData) {
          const { data, error } = await supabase
          .from('active_landmark')
          .select("*");
          liveData = data[0];
        }

        const localData = localStorage.getItem(liveData.uid);
        if (!localData) {
          liveData["attempt"] = 0;
          retryBtn.disabled = false
          localStorage.setItem(liveData.uid, JSON.stringify(liveData));
        }
        _uid = liveData.uid;
        startTimer()

      } catch (error) {
        console.log('Error fetching landmark data:', error);
      }
    }

    // Save user name to localStorage
    function saveUserName() {
      const name = nameInput.value.trim();
      if (name.length === 0) {
        nameInput.status = 'invalid';
        return;
      }

      // Store name in localStorage
      localStorage.setItem('pinThePlace_userName', name);
      sendUserInfo(name);
      
      // Close modal and initialize game
      nameModal.open = false;
      initializeGame();
    }    
    // Save name button click handler
    saveNameBtn.addEventListener('click', saveUserName);

    // Check for user name on app load
    checkUserName();

    // Retry button functionality
    retryBtn.addEventListener('click', function() {
      accuracyModal.open = false;
      maxAttemptModal.open = false;
      timeoverModal.open = false;
    });
    
    let timer = null;
    let timeLeft = ROUND_SECONDS;
    let lastGuessDistance = null;
    // Map setup
    const map = new Map({ 
      // basemap: 'streets-vector',
      basemap: 'osm', 
      // basemap: "satellite",
      ground: "world-elevation"
    });

    let view = new SceneView({
      map: map,
      center: [78.9629, 20.5937],
      zoom: 4,
      container: "viewDiv"
    });
    const graphics = new GraphicsLayer();
    map.add(graphics);

    let homeWidget = new Home({
      view: view
    });
    view.ui.add(homeWidget, "top-left");

    function makeGuessGraphic(lon, lat) {
      return new Graphic({ geometry: new Point({ longitude: lon, latitude: lat }), symbol: { type: 'simple-marker', style: 'circle', color: [24,144,255,0.9], size: '14px', outline: { color: [255,255,255], width: 2 } } });
    }
    
    // Calculate geodesic distance (km)
    function computeDistanceKm(lon1, lat1, lon2, lat2) {
      const poly = new Polyline({ paths: [[[lon1, lat1], [lon2, lat2]]], spatialReference: { wkid: 4326 } });
      return geometryEngine.geodesicLength(poly, 'kilometers');
    }    

    // Show accuracy modal with results
    function showAccuracyModal(distance, timeTaken) {
      modalDistance.textContent = distance !== null ? distance.toFixed(2) + ' km' : 'No guess made';
      modalTime.textContent = timeTaken !== null ? timeTaken.toFixed(1) + ' seconds' : 'N/A';
      
      // Set message based on accuracy
      let message = 'Time\'s up!';
      if (distance !== null) {
        if (distance <= 1) {
          message = 'Excellent! Great job!';
        } else if (distance <= 5) {
          message = 'Good guess! Very close!';
        } else if (distance <= 10) {
          message = 'Not bad! Keep trying!';
        } else {
          message = 'Better luck next time!';
        }
      }
      
      accuracyMessage.textContent = message;
      accuracyModal.open = true;
    }    

    function showTimeOverModal () {
      timeoverModal.open = true;
    }

    view.on('click', async function (evt) {
      const uidData = JSON.parse(localStorage.getItem(_uid));
      if (uidData.attempt >= MAX_ATTEMPTS) {
        maxAttemptModal.open = true;
        return;
      }
      uidData["attempt"] ++;
      localStorage.setItem(uidData?.uid, JSON.stringify(uidData));

      if (uidData.attempt >= MAX_ATTEMPTS) retryBtn.disabled = true;  
      const { data, error } = await supabase
        .from('active_landmark')
        .select("*");
        // Calculate time taken
      const timeTaken = (Date.now() - new Date(data[0]?.created_time)) / 1000;
      if (timeTaken >= ROUND_SECONDS) {
        showTimeOverModal();
        return;
      }
      const lon = evt.mapPoint.longitude; 
      const lat = evt.mapPoint.latitude;

      // add guess marker
      if (guessGraphic) graphics.remove(guessGraphic);
      guessGraphic = makeGuessGraphic(lon, lat);
      graphics.add(guessGraphic);      
      
      // compute distance to target
      const km = computeDistanceKm(lon, lat, data[0].longitude, data[0].latitude);
      lastGuessDistance = km;

      showAccuracyModal(lastGuessDistance, timeTaken);
    });

    // Timer mechanics
    function startTimer () { 
      stopTimer();
      let currentTime = Date.now();
      let startTime = new Date(JSON.parse(localStorage.getItem(_uid))?.created_time);
      let timeDifference = Math.ceil((currentTime - startTime)/1000);
      timeLeft = 60 - timeDifference;
      if (timeDifference >= ROUND_SECONDS) {
        // timerFill.style.width = '100%';
        return;
      } 
      timer = setInterval(()=>{
        timeLeft--;
        const pct = (timeLeft/ROUND_SECONDS)*100; 
        timerFill.style.width = pct + '%';
        if (timeLeft <= 0) { 
          stopTimer();
        }
      },1000);
    }

    function stopTimer () { 
      if (timer) clearInterval(timer); 
    }

    const sendUserInfo = async (name) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert([{
            name
          }]);
      } catch (error) {
        console.log('Error saving user info:', error);
      }
    }

    // Subscribe to realtime changes
    const liveChannel = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'active_landmark' },
        (payload) => {
          if (payload.eventType == "UPDATE" && payload.new.uid !== _uid) {
            accuracyModal.open = false;
            timeoverModal.open = false;
            maxAttemptModal.open = false;
            if (guessGraphic) graphics.remove(guessGraphic)
            getLandmarkInfo(payload.new);
          }
        }
      )
      .subscribe();

    // cleanup on unload
    window.addEventListener('beforeunload', ()=>stopTimer());
  });
