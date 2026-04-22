function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.href = value;
}

function setImageSource(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.src = value;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = document.getElementById("themeToggle");
}

function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
   // Scroll → clase en nav
   const nav = document.getElementById("topNav");
   window.addEventListener("scroll", () => {
     nav.classList.toggle("scrolled", window.scrollY > 20);
   }, { passive: true });

   // Active link al hacer scroll
   const sections = document.querySelectorAll("[id]");
   const navLinks = document.querySelectorAll(".top-nav nav a");

   const io = new IntersectionObserver((entries) => {
     entries.forEach(e => {
       if (e.isIntersecting) {
         navLinks.forEach(a => a.classList.remove("active"));
         const active = document.querySelector(`.top-nav nav a[href="#${e.target.id}"]`);
         if (active) active.classList.add("active");
       }
     });
   }, { threshold: 0.5 });

   sections.forEach(s => io.observe(s));

   // Hamburger
   const hamburger = document.getElementById("hamburger");
   const mobileMenu = document.getElementById("mobileMenu");

   hamburger.addEventListener("click", () => {
     hamburger.classList.toggle("open");
     mobileMenu.classList.toggle("open");
   });

   mobileMenu.querySelectorAll("a").forEach(a => {
     a.addEventListener("click", () => {
       hamburger.classList.remove("open");
       mobileMenu.classList.remove("open");
     });
   });
}

function renderExperience(cards) {
  const wrap = document.getElementById("experienceCards");
  if (!wrap || !Array.isArray(cards)) return;

  wrap.innerHTML = "";
  cards.forEach((item) => {
    const node = document.createElement("article");
    node.className = "exp-card";
    node.innerHTML = `
      <h3>${item.role}</h3>
      <small>${item.period}</small>
      <p>${item.description}</p>
    `;
    wrap.appendChild(node);
  });
}

function renderLanguages(cards) {
  const wrap = document.getElementById("languageCards");
  if (!wrap || !Array.isArray(cards)) return;

  wrap.innerHTML = "";
  cards.forEach((item) => {
    const node = document.createElement("article");
    node.className = "skill-mini";
    node.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.level}</p>
    `;
    wrap.appendChild(node);
  });
}

function renderAbilityCards(cards) {
  const wrap = document.getElementById("abilityCards");
  if (!wrap || !Array.isArray(cards)) return;

  wrap.innerHTML = "";
  cards.forEach((item) => {
    const node = document.createElement("article");
    node.className = "skill-mini";
    node.innerHTML = `
      <h4>${item.title}</h4>
    `;
    wrap.appendChild(node);
  });
}

function renderEducation(cards) {
  const wrap = document.getElementById("educationCards");
  if (!wrap || !Array.isArray(cards)) return;

  wrap.innerHTML = "";
  cards.forEach((item) => {
    const node = document.createElement("article");
    node.className = "exp-card";
    node.innerHTML = `
      <h3>${item.institution}</h3>
      <small>${item.period}</small>
      <p>${item.program}</p>
    `;
    wrap.appendChild(node);
  });
}

function renderProjects(cards) {
  const wrap = document.getElementById("projectCards");
  if (!wrap || !Array.isArray(cards)) return;

  wrap.innerHTML = "";
  cards.forEach((item) => {
    const node = document.createElement("article");
    node.className = "exp-card";
    node.innerHTML = `
      <h3>${item.name}</h3>
      <small>${item.stack || ""}</small>
      <p>${item.description}</p>
      <a class="project-link ${item.github ? "" : "is-disabled"}"
         href="${item.github || "#"}"
         ${item.github ? 'target="_blank" rel="noreferrer"' : ""}
         ${item.github ? "" : 'aria-disabled="true" tabindex="-1"'}>GitHub</a>
    `;
    wrap.appendChild(node);
  });
}

function hydratePortfolio(data) {
  if (!data) return;

  setText("fullName", data.personal?.fullName);
  setText("headline", data.personal?.headline);
  setText("footerText", data.personal?.footerText);
  setImageSource("profilePhoto", data.personal?.photoUrl);
  setHref("cvLink", data.personal?.cvUrl);

  setText("mainSkillDescription", data.skills?.mainDescription);
  renderAbilityCards(data.abilities);
  renderLanguages(data.languages);

  renderExperience(data.experience);
  renderEducation(data.education);
  renderProjects(data.projects);

  setText("contactSummary", data.contact?.summary);
  setText("emailLink", data.contact?.email);
  setText("phoneLink", data.contact?.phone);
  setHref("phoneLink", `tel:${data.contact?.phoneRaw || ""}`);
  setHref("emailLink", `mailto:${data.contact?.email}`);
  setText("locationText", data.contact?.location);
  setHref("locationText", data.contact?.locationMap || "#");
  setHref("linkedinLink", data.contact?.linkedin);
  setHref("portfolioLink", data.contact?.portfolio);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.1 });

document.querySelectorAll(".section-block").forEach(el => observer.observe(el));

hydratePortfolio(portfolioData);
setupThemeToggle();
