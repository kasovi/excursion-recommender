# Release 1.0

May 16, 2025

## Features

### User Authentication
- Register and log in with a username and password
- User context managed globally and persisted via local storage

### Personalized Excursion Recommendations
- Select tags, enter a city, and provide a description
- Recommendations generated using **OpenAI GPT-4** and the **Google Places API**
- Results include:
  - A catchy custom title
  - A summary
  - A Google Maps link

### Recommendation Library
- Save recommendations to your personal library
- View, add, and delete saved recommendations

### Browser Geolocation
- Quickly set your location with a single click when generating recommendations

### Itinerary Builder
- Create custom itineraries by selecting from your saved recommendations
- Add, view, and delete multiple itineraries

### Modern UI/UX
- Responsive, animated React interface with **Framer Motion** transitions
- Clean dark mode interface using modular CSS

### API and Backend
- **Flask** backend with modular blueprints for:
  - Authentication
  - Recommendation generation
  - Location services
- **SQLite** database for persistent storage of:
  - Users
  - Recommendations
  - Itineraries
