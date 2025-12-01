// Movie Explorer - Simple & Classy
class MovieExplorer {
  constructor() {
    this.movies = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;
    this.API_KEY = "YOUR_TMDB_API_KEY"; // Add your key here
    this.BASE_URL = "https://api.themoviedb.org/3";
    this.IMAGE_URL = "https://image.tmdb.org/t/p/w500";

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadMovies();
    this.hideLoading();
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.currentPage = 1;
          this.loadMovies();
        }, 500);
      });
    }

    // Filters
    ["genreFilter", "yearFilter", "sortFilter"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("change", () => this.filterMovies());
      }
    });

    // Clear filters
    const clearBtn = document.getElementById("clearFilters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearFilters());
    }

    // Load more
    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => this.loadMoreMovies());
    }

    // Theme toggle
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Modal close
    const modalClose = document.getElementById("modalClose");
    if (modalClose) {
      modalClose.addEventListener("click", () => this.hideModal());
    }

    // Close modal on backdrop click
    const modal = document.getElementById("movieModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.hideModal();
      });
    }

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("flex")) {
        this.hideModal();
      }
    });
  }

  async loadMovies(page = 1) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      const searchTerm =
        document.getElementById("searchInput")?.value.trim() || "";
      let url;

      if (searchTerm) {
        url = `${this.BASE_URL}/search/movie?api_key=${
          this.API_KEY
        }&query=${encodeURIComponent(searchTerm)}&page=${page}`;
      } else {
        url = `${this.BASE_URL}/discover/movie?api_key=${this.API_KEY}&sort_by=popularity.desc&page=${page}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (page === 1) {
        this.movies = data.results || [];
      } else {
        this.movies.push(...(data.results || []));
      }

      this.currentPage = data.page;
      this.totalPages = data.total_pages;

      this.renderMovies();
      this.updateStats();
    } catch (error) {
      console.error("Error loading movies:", error);
      this.showError();
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }

  async loadMoreMovies() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.loadMovies(this.currentPage);
    }
  }

  renderMovies() {
    const grid = document.getElementById("movieGrid");
    if (!grid) return;

    if (this.movies.length === 0) {
      grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-film text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No movies found</h3>
                    <p class="text-gray-500">Try a different search or filter</p>
                </div>
            `;
      return;
    }

    grid.innerHTML = "";

    this.movies.forEach((movie) => {
      const card = this.createMovieCard(movie);
      grid.appendChild(card);
    });

    this.updateLoadMoreButton();
  }

  createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "group cursor-pointer";

    const rating = movie.vote_average?.toFixed(1) || "N/A";
    const year = movie.release_date?.substring(0, 4) || "N/A";
    const poster = movie.poster_path
      ? `${this.IMAGE_URL}${movie.poster_path}`
      : "https://via.placeholder.com/400x600/1f2937/ffffff?text=No+Image";

    card.innerHTML = `
            <div class="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img 
                    src="${poster}" 
                    alt="${movie.title}"
                    class="w-full h-64 object-cover"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/400x600/1f2937/ffffff?text=Image+Error'"
                >
                
                <div class="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    ⭐ ${rating}
                </div>
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="absolute bottom-4 left-4 right-4 text-white">
                        <h3 class="font-bold text-lg mb-1">${this.escapeHtml(
                          movie.title
                        )}</h3>
                        <p class="text-sm opacity-90">${year}</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-3">
                <h4 class="font-semibold text-gray-800 dark:text-white truncate">${this.escapeHtml(
                  movie.title
                )}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">${year} • ${rating}/10</p>
            </div>
        `;

    card.addEventListener("click", () => this.showMovieDetails(movie.id));
    return card;
  }

  async showMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/movie/${movieId}?api_key=${this.API_KEY}`
      );
      const movie = await response.json();

      this.showModal(movie);
    } catch (error) {
      console.error("Error loading movie details:", error);
      this.showToast("Failed to load movie details", "error");
    }
  }

  showModal(movie) {
    const modal = document.getElementById("movieModal");
    const modalBody = document.getElementById("modalBody");

    if (!modal || !modalBody) return;

    const poster = movie.poster_path
      ? `${this.IMAGE_URL}${movie.poster_path}`
      : "https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Image";

    const rating = movie.vote_average?.toFixed(1) || "N/A";
    const runtime = movie.runtime
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : "N/A";

    modalBody.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <img src="${poster}" alt="${
      movie.title
    }" class="w-full rounded-xl shadow-lg">
                </div>
                
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">${this.escapeHtml(
                      movie.title
                    )}</h2>
                    
                    <div class="flex items-center gap-4 mb-4">
                        <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                            ⭐ ${rating}/10
                        </span>
                        <span class="text-gray-600 dark:text-gray-400">${runtime}</span>
                        <span class="text-gray-600 dark:text-gray-400">${
                          movie.release_date?.substring(0, 4) || "N/A"
                        }</span>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Overview</h3>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${
                          movie.overview || "No description available."
                        }</p>
                    </div>
                    
                    ${
                      movie.genres?.length
                        ? `
                        <div class="mb-6">
                            <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Genres</h3>
                            <div class="flex flex-wrap gap-2">
                                ${movie.genres
                                  .map(
                                    (genre) => `
                                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                        ${genre.name}
                                    </span>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  hideModal() {
    const modal = document.getElementById("movieModal");
    if (modal) {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    }
  }

  filterMovies() {
    const genre = document.getElementById("genreFilter")?.value || "all";
    const year = document.getElementById("yearFilter")?.value || "all";
    const sort = document.getElementById("sortFilter")?.value || "popularity";

    let filtered = [...this.movies];

    if (genre !== "all") {
      filtered = filtered.filter((m) => m.genre_ids?.includes(parseInt(genre)));
    }

    if (year !== "all") {
      filtered = filtered.filter(
        (m) => m.release_date?.substring(0, 4) === year
      );
    }

    switch (sort) {
      case "rating":
        filtered.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "year":
        filtered.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => b.popularity - a.popularity);
    }

    this.renderFilteredMovies(filtered);
  }

  renderFilteredMovies(filteredMovies) {
    const grid = document.getElementById("movieGrid");
    if (!grid) return;

    grid.innerHTML = "";

    if (filteredMovies.length === 0) {
      grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No matching movies</h3>
                    <p class="text-gray-500">Try different filters</p>
                </div>
            `;
      return;
    }

    filteredMovies.forEach((movie) => {
      const card = this.createMovieCard(movie);
      grid.appendChild(card);
    });
  }

  clearFilters() {
    document.getElementById("genreFilter").value = "all";
    document.getElementById("yearFilter").value = "all";
    document.getElementById("sortFilter").value = "popularity";
    this.filterMovies();
  }

  toggleTheme() {
    const html = document.documentElement;
    const themeBtn = document.getElementById("themeToggle");
    const icon = themeBtn?.querySelector("i");

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      icon?.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      icon?.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark");
    }
  }

  updateStats() {
    const countEl = document.getElementById("movieCount");
    if (countEl) {
      countEl.textContent = this.movies.length;
    }
  }

  updateLoadMoreButton() {
    const btn = document.getElementById("loadMore");
    const container = document.getElementById("loadMoreContainer");

    if (btn && container) {
      if (this.currentPage < this.totalPages) {
        btn.textContent = `Load More (${this.currentPage}/${this.totalPages})`;
        container.classList.remove("hidden");
      } else {
        container.classList.add("hidden");
      }
    }
  }

  showLoading() {
    const skeleton = document.getElementById("skeletonGrid");
    const grid = document.getElementById("movieGrid");

    if (skeleton) skeleton.classList.remove("hidden");
    if (grid) grid.classList.add("hidden");
  }

  hideLoading() {
    const skeleton = document.getElementById("skeletonGrid");
    const grid = document.getElementById("movieGrid");
    const loadingScreen = document.getElementById("loadingScreen");

    if (skeleton) skeleton.classList.add("hidden");
    if (grid) grid.classList.remove("hidden");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => loadingScreen.remove(), 300);
    }
  }

  showError() {
    const errorEl = document.getElementById("errorState");
    if (errorEl) {
      errorEl.classList.remove("hidden");
    }
  }

  showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    const messageEl = document.getElementById("toastMessage");

    if (!toast || !messageEl) return;

    // Set color based on type
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    };

    toast.className = `${
      colors[type] || colors.info
    } text-white px-4 py-3 rounded-lg shadow-lg fixed bottom-4 right-4 z-50`;
    messageEl.textContent = message;

    // Show toast
    toast.classList.remove("hidden");
    toast.classList.add("animate-fade-in");

    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove("animate-fade-in");
      toast.classList.add("animate-fade-out");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MovieExplorer();
});
