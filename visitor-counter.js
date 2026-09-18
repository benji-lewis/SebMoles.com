/**
 * Fills in the "You are visitor number N" counter.
 *
 * Asks /api/visits to count this visitor, then renders the number as a row of
 * classic odometer digits. If the counter is unreachable the surrounding
 * markup degrades to a quiet placeholder and the rest of the page is
 * unaffected.
 */
(function () {
  "use strict";

  var box = document.getElementById("visitor-counter");
  if (!box) return;

  var slot = box.querySelector("[data-visitor-count]");
  if (!slot) return;

  function renderDigits(value) {
    var digits = String(value);
    // Classic counters were always zero-padded to a fixed width.
    while (digits.length < 6) digits = "0" + digits;

    slot.textContent = "";
    for (var i = 0; i < digits.length; i++) {
      var cell = document.createElement("span");
      cell.className = "odometer-digit";
      cell.textContent = digits.charAt(i);
      slot.appendChild(cell);
    }
  }

  function fail() {
    box.classList.add("visitor-counter-offline");
    slot.textContent = "??????";
  }

  fetch("/api/visits", {
    method: "POST",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
    cache: "no-store"
  })
    .then(function (response) {
      if (!response.ok) throw new Error("counter responded " + response.status);
      return response.json();
    })
    .then(function (data) {
      var number = data && typeof data.you === "number" ? data.you : null;
      if (number === null) throw new Error("counter returned no number");

      renderDigits(number);
      if (data.returning) {
        box.setAttribute("title", "welcome back, visitor number " + number);
      }
    })
    .catch(fail);
})();
