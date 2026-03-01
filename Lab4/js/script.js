// -------------------- API endpoints --------------------
    const API_CITYINFO = "https://csumb.space/api/cityInfoAPI.php?zip=";
    const API_STATES   = "https://csumb.space/api/allStatesAPI.php";
    const API_COUNTIES = "https://csumb.space/api/countyListAPI.php?state=";
    const API_USER     = "https://csumb.space/api/usernamesAPI.php?username=";
    const API_PASS     = "https://csumb.space/api/suggestedPassword.php?length=";

    // -------------------- Helpers --------------------
    const $ = (id) => document.getElementById(id);

    function setZipNotFound(show) {
      $("zipMsg").classList.toggle("show", show);
    }

    function clearCityFields() {
      $("city").value = "";
      $("lat").value = "";
      $("lng").value = "";
    }

    function setUserStatus(text, cls) {
      const el = $("userStatus");
      el.textContent = text;
      el.classList.remove("ok", "bad", "warn");
      el.classList.add(cls);
    }

    function showToast(type) {
      $("successToast").style.display = (type === "success") ? "block" : "none";
      $("errorToast").style.display   = (type === "error") ? "block" : "none";
    }

    // Debounce so we don’t spam the username API on every keystroke
    function debounce(fn, wait = 350) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
      };
    }

    // -------------------- Feature 6: Load all US states --------------------
    async function loadStates() {
      const sel = $("state");
      sel.innerHTML = `<option value="">Loading states...</option>`;
      try {
        const res = await fetch(API_STATES);
        const data = await res.json();

        // The API typically returns an array of objects containing state + abbreviation.
        // We'll try common key names safely.
        const states = Array.isArray(data) ? data : (data.states || data);

        sel.innerHTML = `<option value="">Select a state</option>`;
        states.forEach((s) => {
          const name = s.state || s.name || s.State || s.STATE;
          const abbr = s.usps || s.abbreviation || s.abbrev || s.code || s.abb || s.USPS;
          if (!name || !abbr) return;

          const opt = document.createElement("option");
          opt.value = String(abbr).toLowerCase(); // county API example uses lowercase
          opt.textContent = `${name} (${String(abbr).toUpperCase()})`;
          sel.appendChild(opt);
        });
      } catch (e) {
        sel.innerHTML = `<option value="">Failed to load states</option>`;
        console.error("State load error:", e);
      }
    }

    // -------------------- Feature 3: Update counties on state selection --------------------
    async function loadCountiesForState(stateAbbrLower) {
      const countySel = $("county");
      countySel.disabled = true;
      countySel.innerHTML = `<option value="">Loading counties...</option>`;

      if (!stateAbbrLower) {
        countySel.innerHTML = `<option value="">Select a state first</option>`;
        return;
      }

      try {
        const res = await fetch(API_COUNTIES + encodeURIComponent(stateAbbrLower));
        const data = await res.json();

        // Typically array of county names; handle common variants.
        const counties = Array.isArray(data)
          ? data
          : (data.counties || data.Counties || data);

        countySel.innerHTML = `<option value="">Select a county</option>`;
        counties.forEach((c) => {
          const name = (typeof c === "string") ? c : (c.county || c.name || c.County);
          if (!name) return;
          const opt = document.createElement("option");
          opt.value = name;
          opt.textContent = name;
          countySel.appendChild(opt);
        });

        countySel.disabled = false;
      } catch (e) {
        countySel.innerHTML = `<option value="">Failed to load counties</option>`;
        console.error("County load error:", e);
      }
    }

    // -------------------- Feature 1 & 2: Zip -> City/Lat/Lng + Not found message --------------------
    async function updateCityInfoFromZip(zip) {
      const trimmed = (zip || "").trim();
      setZipNotFound(false);

      if (trimmed.length < 5) {
        clearCityFields();
        return;
      }

      try {
        const res = await fetch(API_CITYINFO + encodeURIComponent(trimmed));
        const data = await res.json();

        // The API may return something like:
        // { "zip":"93955","city":"Seaside","latitude":"36.6","longitude":"-121.8" }
        // If not found, it might return {} or missing keys.
        const city = data.city || data.City;
        const lat  = data.latitude || data.lat || data.Latitude;
        const lng  = data.longitude || data.lng || data.Longitude;

        if (!city || !lat || !lng) {
          clearCityFields();
          setZipNotFound(true);
          return;
        }

        $("city").value = city;
        $("lat").value = lat;
        $("lng").value = lng;
      } catch (e) {
        clearCityFields();
        setZipNotFound(true);
        console.error("Zip lookup error:", e);
      }
    }

    // -------------------- Feature 4: Username availability (color-coded) --------------------
    async function checkUsernameAvailability(username) {
      const u = (username || "").trim();

      if (!u) {
        setUserStatus("Type a username to check availability.", "warn");
        return;
      }
      if (u.length < 3) {
        setUserStatus("Username must be at least 3 characters.", "warn");
        return;
      }

      try {
        const res = await fetch(API_USER + encodeURIComponent(u));
        const data = await res.json();

        // The API commonly returns { "available": true/false } (or similar).
        // We'll interpret a few common patterns.
        const available =
          (typeof data.available === "boolean") ? data.available :
          (typeof data.isAvailable === "boolean") ? data.isAvailable :
          (typeof data.status === "string") ? (data.status.toLowerCase().includes("available")) :
          (typeof data === "boolean") ? data :
          false;

        if (available) setUserStatus("✅ Username is available", "ok");
        else setUserStatus("❌ Username is not available", "bad");
      } catch (e) {
        setUserStatus("⚠️ Could not verify username right now.", "warn");
        console.error("Username check error:", e);
      }
    }

    // -------------------- Feature 5: Suggested password on focus --------------------
    async function suggestPassword(length = 10) {
      try {
        const res = await fetch(API_PASS + encodeURIComponent(String(length)));
        const data = await res.json();

        // Common returns: { "password":"Abc123..." } or plain string
        const pw = data.password || data.suggestedPassword || data.pw || (typeof data === "string" ? data : "");

        if (pw) {
          $("pwSuggest").innerHTML = `Suggested: <span class="mono">${pw}</span>`;
        } else {
          $("pwSuggest").textContent = "Suggested password unavailable.";
        }
      } catch (e) {
        $("pwSuggest").textContent = "Suggested password unavailable.";
        console.error("Password suggestion error:", e);
      }
    }

    // -------------------- Submit validations --------------------
    function validateOnSubmit() {
      const username = $("username").value.trim();
      const password = $("password").value;
      const retype   = $("retype").value;

      let ok = true;

      // 1) Username at least 3 chars
      if (username.length < 3) {
        ok = false;
        setUserStatus("❌ Username must be at least 3 characters.", "bad");
      }

      // 2) Password at least 6 chars
      if (password.length < 6) {
        ok = false;
        $("pwSuggest").innerHTML = `<span class="status bad">❌ Password must be at least 6 characters.</span>`;
      }

      // 3) Password matches retype
      if (password !== retype) {
        ok = false;
        $("pwSuggest").innerHTML = `<span class="status bad">❌ Passwords do not match.</span>`;
      }

      return ok;
    }

    // -------------------- Wire up events --------------------
    document.addEventListener("DOMContentLoaded", async () => {
      await loadStates();

      $("zip").addEventListener("input", debounce((e) => {
        updateCityInfoFromZip(e.target.value);
      }, 300));

      $("state").addEventListener("change", (e) => {
        loadCountiesForState(e.target.value);
      });

      $("username").addEventListener("input", debounce((e) => {
        checkUsernameAvailability(e.target.value);
      }, 350));

      $("password").addEventListener("focus", () => suggestPassword(10));

      $("resetBtn").addEventListener("click", () => {
        $("signupForm").reset();
        clearCityFields();
        setZipNotFound(false);
        $("pwSuggest").textContent = "";
        setUserStatus("Type a username to check availability.", "warn");
        $("county").innerHTML = `<option value="">Select a state first</option>`;
        $("county").disabled = true;
        showToast(null);
      });

      $("signupForm").addEventListener("submit", (e) => {
        e.preventDefault();
        showToast(null);

        const ok = validateOnSubmit();
        if (ok) {
          showToast("success");
        } else {
          showToast("error");
        }
      });
    });
