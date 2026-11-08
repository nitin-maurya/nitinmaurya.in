/* Contact details are kept out of the HTML so address harvesters can't scrape them.
   They are stored encoded here and only decoded when a visitor clicks.
   To change one: hex of each char XOR 0x5A, then reverse the whole string. */
(function () {
  "use strict";
  var D = {
    email: { v: "7353934713535363e2f253a1b33282f2b373504333e23343", s: "mail" + "to:" },
    phone: { v: "368626c6a69696b6a636b63617", t: "368626c6a6a79696b6a636a7b63617", s: "te" + "l:" }
  };
  function dec(h) {
    h = h.split("").reverse().join("");
    var out = "";
    for (var i = 0; i < h.length; i += 2) out += String.fromCharCode(parseInt(h.substr(i, 2), 16) ^ 0x5a);
    return out;
  }
  function href(k) { return D[k].s + dec(D[k].v); }

  // "Show email" / "Show phone" buttons: swap in a real link, then focus it.
  document.querySelectorAll("button[data-reveal]").forEach(function (b) {
    b.hidden = false;
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-reveal");
      var a = document.createElement("a");
      a.href = href(k);
      a.textContent = dec(D[k].t || D[k].v);
      b.replaceWith(a);
      a.focus();
    });
  });

  // Links that should open the mail client directly (they fall back to #contact without JS).
  document.querySelectorAll("a[data-mail]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      location.href = href("email");
    });
  });

})();
