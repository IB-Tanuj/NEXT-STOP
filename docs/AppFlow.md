# App Flow — Navigation & User Journey Map

**Pages List** = 
- `/` (Home)
- `/trip` (Trip Details Page - dynamic)
- `About` (Modal/Overlay)
- `Explore` (Sidebar)
- `Budget` (Overlay)
- `Plan Trip` (Overlay)

**Navigation Type** = Top navbar containing links to main features, left sidebar for Explore, overlays/modals for secondary actions.

**First Screen** = A vibrant Hero section displaying a search bar, seasonal recommendations, and dynamic background based on theme.

**Auth Flow** = 

**Core User Journey 1** = Step-by-step: User wants to explore a specific location. They go to Home -> enter a location in the search bar or click a suggested card -> they are redirected to the Trip Page where they can view detailed location  and maps.

**Core User Journey 2** = Step-by-step: User wants to estimate trip costs. They go to Home -> click "Budget" in the Navbar -> fill out the budget calculation form in the overlay -> view their estimated expenses.

xhr.open('GET', 'https://flixbus-api2.p.rapidapi.com/timetable?cityId=40d8f682-8646-11e6-9066-549f350fcb0c&date=2026-08-01');
xhr.setRequestHeader('x-rapidapi-key', 'f817651148msh728be16da7b7b61p1063e4jsn6d6496b45ea6');
xhr.setRequestHeader('x-rapidapi-host', 'flixbus-api2.p.rapidapi.com');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.send(data);
