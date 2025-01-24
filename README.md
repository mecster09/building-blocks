# Task List Dashboard Web App

## Overview
This project is a responsive **Task List Dashboard Web App** built using **Next.js 14**. The app provides two distinct views for tasks based on the device:
- **Mobile View**: A simplified, minimalistic design using a card-based layout for readability.
- **Tablet/PC View**: A detailed, grid-like layout, inspired by the attached screenshot.

The app leverages **Lucide Icons** for intuitive navigation and task interactions.

---

## Key Features

### Common Functionality
- **Task Management**: Add tasks, view tasks, and manage them efficiently.
- **Date and Time**: All date and time data are stored in UTC but displayed in the user's system's local time.
- **User Tracking**: All events are tracked with the user who performed them and when.

### Add Task Functionality
- **Category Assignment**: Tasks can have a category (or no category by default).
- **Due Date**: Tasks can have a target due date (or no date by default).
- **Assignees**: Tasks can be assigned to other users or default to the creator.
- **Tags**: Tasks can have custom tags (free text) or no tags by default.

### View Task Functionality
- **View All Tasks**: See all tasks in one place (similar to the provided screenshot).
- **View by Category**: Filter tasks by their assigned category.
- **View by Due Date**: Organize tasks by their due date.
- **View by Assigned**: Filter tasks by their assigned user.

---

## Current Implementation

### Features Included
1. **Responsive Layout**:
   - Adapts to both mobile and desktop screens seamlessly.
2. **Sidebar Navigation**:
   - Includes navigation options with **Lucide Icons** for better UX.
3. **Task List Views**:
   - **Mobile View**: Card-based task layout for readability.
   - **Desktop View**: Grid-based layout as per the screenshot.
4. **Task Addition Form**:
   - Input fields for:
     - Title
     - Category
     - Due Date (Picker)
     - Tags (Free Text)
     - Assignee Selection
5. **Type Safety**:
   - **TypeScript** interfaces ensure robust and scalable development.
6. **UTC Date Handling**:
   - Stores all dates in UTC for consistency.
   - (Note: Conversion logic for display is to be implemented.)
7. **User Tracking**:
   - Tracks the user who created or updated tasks along with timestamps.

---

## To-Do List
The following features are yet to be implemented:

1. **Database Integration**:
   - Use a database solution (e.g., **Prisma**) for persistent storage.
2. **Server Actions**:
   - Implement backend logic for task creation and updates.
3. **Authentication**:
   - Add user authentication (e.g., using **NextAuth.js**).
4. **Real-Time Updates**:
   - Enable real-time updates (e.g., **Server-Sent Events** or **WebSockets**).
5. **Enhanced Views**:
   - Complete functionality for viewing tasks by category, due date, and assigned user.

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/task-list-dashboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd task-list-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
To start the development server, run:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Technologies Used
- **Next.js 14**: React-based framework for building scalable web applications.
- **Lucide Icons**: Icon set for modern, minimalist design.
- **TypeScript**: Ensures type safety and scalability.

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Screenshots
### Mobile View


### Desktop View

