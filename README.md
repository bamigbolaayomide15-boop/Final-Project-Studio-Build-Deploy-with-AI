# Final-Project-Studio-Build-Deploy-with-AI

A beautiful, responsive movie discovery app built with Tailwind CSS and vanilla JavaScript. Browse, search, and filter movies from TMDB API with an elegant dark/light mode interface.

## ✨ Features

- **Movie Discovery** - Browse trending/popular movies
- **Smart Search** - Real-time search with debouncing
- **Advanced Filtering** - By genre, year, rating
- **Movie Details** - Comprehensive modal view
- **Dark/Light Mode** - With system preference
- **Responsive Design** - Mobile-first approach
- **Local Storage** - Save preferences/favorites

## 🚀 Quick Start

### 1. Get API Key

1. Sign up at [TMDB](https://www.themoviedb.org/signup)
2. Get API key from [Settings/API](https://www.themoviedb.org/settings/api)

### 2. Run Locally

```bash
# Clone repo
git clone https://github.com/yourusername/cinevibe.git
cd cinevibe

# Edit app.js - replace API key
this.API_KEY = 'YOUR_TMDB_API_KEY';

# Open index.html in browser
```

### 3. Deploy

- **Vercel**: Drag & drop folder
- **Netlify**: Connect GitHub repo
- **GitHub Pages**: Enable in repo settings

## 📁 Project Structure

```
cinevibe/
├── index.html      # Main HTML
├── app.js          # All JavaScript logic
├── README.md       # Documentation
└── assets/         # Images/icons
```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **JavaScript ES6+** - Vanilla JS, no frameworks
- **TMDB API** - Movie data source
- **Font Awesome** - Icons

## 🎮 How to Use

1. **Browse** - Scroll through movie grid
2. **Search** - Type in search box (auto-searches)
3. **Filter** - Use dropdowns for genre/year/sort
4. **Click** any movie for details
5. **Toggle** theme with moon/sun icon

## 🔧 Key Functions

| Function             | Purpose                |
| -------------------- | ---------------------- |
| `loadMovies()`       | Fetch movies from TMDB |
| `showMovieDetails()` | Display movie modal    |
| `filterMovies()`     | Apply filters/sorting  |
| `toggleTheme()`      | Switch dark/light mode |
| `showToast()`        | User notifications     |

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640px-1024px (2-3 columns)
- **Desktop**: > 1024px (4-5 columns)

## 🌐 API Endpoints Used

```
GET /discover/movie      # Trending movies
GET /search/movie        # Search movies
GET /movie/{id}          # Movie details
GET /genre/movie/list    # All genres
```

## 🎨 Design System

```css
Primary Colors:
- Blue: #3b82f6 (Buttons, links)
- Purple: #8b5cf6 (Accents)
- Dark BG: #0f172a
- Light BG: #f8fafc

Typography:
- Font: Inter (sans-serif)
- Headings: 600-700 weight
- Body: 400 weight
```

## ⚡ Performance

- **Images**: Lazy loading, WebP format
- **API**: Debounced search, cached responses
- **CSS**: Tailwind purged for production
- **JS**: Modular, tree-shakeable

## 🧪 Testing

```bash
# Manual tests
- Test all filters work
- Verify mobile responsiveness
- Check dark/light mode toggle
- Test search with debounce
- Validate API error handling
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -m 'Add xyz'`)
4. Push to branch (`git push origin feature/xyz`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

- **Movie Data**: The Movie Database (TMDB)
- **Icons**: Font Awesome
- **CSS Framework**: Tailwind CSS
- **Fonts**: Google Fonts (Inter)

## 📞 Support

- **Issues**: GitHub Issues tab
- **Questions**: Open discussion
- **Feature Requests**: Submit issue

---

# 📋 Project Spec

## Overview

Single-page movie discovery app using TMDB API with clean, modern UI.

## User Stories

- As a user, I want to browse trending movies
- As a user, I want to search for specific movies
- As a user, I want to filter movies by genre/year
- As a user, I want to view movie details
- As a user, I want to toggle dark/light mode

## Technical Requirements

### Frontend

- **Framework**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS + custom CSS
- **Icons**: Font Awesome 6
- **Responsive**: Mobile-first design
- **Browser Support**: Chrome, Firefox, Safari, Edge

### Backend (API)

- **Provider**: TMDB API v3
- **Authentication**: API key
- **Rate Limit**: 40 requests/10 seconds
- **Caching**: localStorage for frequent calls

### Features Matrix

| Feature       | Priority | Status     |
| ------------- | -------- | ---------- |
| Movie Grid    | Must     | ✅ Done    |
| Search        | Must     | ✅ Done    |
| Filters       | Must     | ✅ Done    |
| Movie Details | Must     | ✅ Done    |
| Dark Mode     | Should   | ✅ Done    |
| Favorites     | Could    | 🔄 Planned |
| Trailers      | Could    | 🔄 Planned |
| Ratings       | Could    | 🔄 Planned |

### Performance Targets

- **Load Time**: < 2.5 seconds
- **TTI**: < 3 seconds
- **Lighthouse**: > 90 all categories
- **Bundle Size**: < 100KB

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast compliant

### SEO

- ✅ Semantic markup
- ✅ Meta tags
- ✅ Open Graph tags
- ✅ Structured data (planned)

## Development Phases

### Phase 1: MVP (Complete)

- Basic movie grid
- Search functionality
- Movie details modal
- Responsive layout

### Phase 2: Enhanced (Complete)

- Advanced filters (genre/year/sort)
- Dark/light mode
- Loading states
- Error handling

### Phase 3: Polish (Current)

- Animations/transitions
- Performance optimization
- PWA capabilities
- Offline support

### Phase 4: Future

- User accounts
- Watchlists
- Movie reviews
- Social sharing
- Recommendations

## File Structure

```bash
index.html          # Main HTML
app.js              # All JavaScript
  ├── MovieExplorer class
  ├── API functions
  ├── UI handlers
  └── Utility functions
assets/             # Static files
  ├── images/
  ├── icons/
  └── screenshots/
README.md           # Documentation
```

## API Design

```javascript
// API wrapper example
const API = {
  getMovies(page = 1, filters = {}) {},
  searchMovies(query) {},
  getMovieDetails(id) {},
  getGenres() {},
  getSimilarMovies(id) {},
};
```

## State Management

```javascript
// App state
const state = {
  movies: [], // All movies
  filteredMovies: [], // Filtered results
  genres: [], // Available genres
  currentPage: 1, // Pagination
  totalPages: 1, // Total pages
  isLoading: false, // Loading state
  currentMovie: null, // Selected movie
  theme: "dark", // UI theme
  favorites: new Set(), // Favorite movies
};
```

## Error Handling

- Network failures
- API rate limits
- Invalid searches
- Missing movie data
- Browser compatibility

## Testing Checklist

- [x] Load movies successfully
- [x] Search functionality
- [x] Filter by genre/year
- [x] Sort options
- [x] Movie details modal
- [x] Dark/light mode toggle
- [x] Responsive design
- [x] Error states
- [x] Loading states
- [x] Local storage persistence

## Deployment Checklist

- [ ] API key secured
- [ ] Images optimized
- [ ] CSS purged
- [ ] Error tracking set up
- [ ] Analytics configured
- [ ] SEO tags added
- [ ] PWA manifest
- [ ] Caching strategy

## Maintenance

- **Daily**: Check API health
- **Weekly**: Update dependencies
- **Monthly**: Review performance metrics
- **Quarterly**: Update feature roadmap

## Success Metrics

- **Engagement**: > 3 min session duration
- **Retention**: > 30% return rate
- **Performance**: < 2s load time
- **Satisfaction**: > 4/5 star rating

---
