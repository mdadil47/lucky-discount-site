# Momomia Lucky Draw 🎡

A lightweight, **mobile-friendly spin-the-wheel web app** that lets users test their luck
for Momomia promotions.  
The wheel spins with weighted odds, shows the winning slice, starts a countdown,
and then automatically exits the page.



## ✨ Features
| Feature | Details |
|---------|---------|
| 🎨 **3-D style wheel** | CSS‐only conic-gradient for 10 equal slices |
| 🏷 **Radial labels** | Prize text runs down the centre of each slice; auto-flips on the lower half so nothing is upside-down |
| ⚖️ **Weighted prizes** | Odds controlled by an easy array (`weights[]`) in `script.js` |
| 🔒 **Spin lock** | Each browser can spin **once every 12 hours** (stored in `localStorage`) |
| ⏱ **Auto-exit** | 30-second countdown after the result, then tries `window.close()` and falls back to `thankyou.html` |
| 📱 **Responsive** | Looks great on phones & desktops; tap or press the **Spin Now** button |
| 🚀 **1-file deploy** | Static front-end—host on GitHub Pages, Netlify.

