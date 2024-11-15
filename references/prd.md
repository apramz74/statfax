Project Technical Specification: NBA Stats Lookup App
Overview
The app will enable users to query NBA statistics by entering natural language statements or questions. The app will parse the input to identify key components (e.g., player, stat type, and conditions) and will use an external API to retrieve relevant data. The UI will display the answer in a structured, easy-to-read format with query breakdown and a results section.
Core Components (with Updates)
UI Components

Search Bar: Accepts natural language input for NBA-related queries (e.g., “How many games has Steph Curry made over 4 three-pointers?”).
Query Breakdown:
Dynamically displays parsed query components, each of which can be clicked and modified.
For components like Player or Team, clicking allows the user to search and select different players or teams.
For Stat Category (e.g., "Three Pointers"), clicking opens a selection of alternative statistics (e.g., "Rebounds," "Assists").
Conditional Modifications: For conditions like “Over 4,” users should be able to adjust the condition (e.g., changing from “Over” to “Under” or modifying the value).
Result Display:
Shows a concise summary answer to the query (e.g., total number of games or total rebounds).
Displays a detailed breakdown table that provides context for the initial result (e.g., a table of games or a summary of performances across a season).
NLP Module (AI-powered)

Interprets user input to identify key entities (e.g., player, stat type) and conditions (over/under values).
Handles ambiguous or incomplete queries by guiding the user to clarify the query.
Sends parsed components back to the front end, enabling them to populate the Query Breakdown section.
Data Retrieval Module

Queries API-NBA from Rapid based on user-selected query components.
Retrieves a flexible set of results based on the parsed entities and displays contextually relevant data in the detailed table.
Allows modifications to the query directly from the breakdown, triggering new API requests if components change.
Data Flow Pipeline

User input → NLP Parsing → Query Breakdown with Interactive Modifications → API Data Fetch → Result Display Update.
Updated Milestones
Milestone 1: Core UI Setup
Goal: Build and style the main UI components with placeholder interactivity.
Tasks:
Search Bar: Text input for natural language queries.
Query Breakdown Section: Display placeholders for parsed components with clickable elements.
Result Display Section: Add placeholders for summary and detailed table data.
Outcome: A basic UI where users can enter a query, view parsed components, and see sample results.
Milestone 2: NLP Integration for Query Parsing
Goal: Use Google Gemini API (or equivalent NLP service) for natural language query parsing.
Tasks:
Connect the app’s backend to the Google Gemini API.
Parse user input to extract query components and send these to the UI.
Populate the Query Breakdown section with clickable parsed elements (e.g., player, stat type, condition).
Outcome: The app can parse inputs and display parsed query components. Users can see and verify parsed components, such as “Stephen Curry,” “Three Pointers,” and “Over 4.”
Milestone 3: Interactive Query Modifications
Goal: Enable users to click and modify each component of the query breakdown.
Tasks:
Implement clickable query components in the Query Breakdown section.
Player/Team: On click, opens a search dialog with popular players and teams. Includes a search bar for custom entries.
Stat Category: Allows selection from common stat categories like rebounds, assists, points, etc.
Condition: Editable condition (e.g., changing “Over 4” to “Under 6”).
Trigger an API data refresh when any component is changed, updating both the summary and detailed result sections.
Outcome: Users can dynamically adjust their queries through the Query Breakdown section. Each change refreshes the displayed results to reflect the updated query.
Milestone 4: Data Retrieval and Enhanced Result Display
Goal: Retrieve data from API-NBA and display both a concise answer and a flexible, context-specific detailed table.
Tasks:
Summary Answer: Display concise, high-level statistics as a direct answer to the query (e.g., “5 games” or “123 rebounds”).
Contextual Detailed Table:
Dynamic Table Structure: Table format adjusts to the query type.
For a game-related query (e.g., games with over a certain number of three-pointers), the table shows game dates, opponents, and specific stats.
For season or cumulative queries (e.g., total points in a season), the table might show monthly breakdowns, performance trends, or per-game stats for the season.
User-Friendly Display: Make the table sortable and paginated if needed.
Data Transformation and Formatting: Ensure raw data from API-NBA is transformed into a user-friendly format (e.g., converting timestamps, formatting numbers).
Outcome: The app displays both a summary answer and a detailed table that adapts to the query type, providing users with a meaningful, context-aware breakdown of results.
Milestone 5: Error Handling & Edge Cases
Goal: Provide robust error handling and guidance for unsupported queries.
Tasks:
Handle cases where NLP parsing fails by prompting the user to rephrase or clarify.
Implement validation for player names, team names, and statistical categories (e.g., auto-suggestions for popular players).
Display fallback error messages if API data retrieval fails or if rate limits are exceeded.
Outcome: Users receive clear feedback on errors or unsupported inputs, improving the overall user experience.
Additional Considerations
API Query Optimization: Use caching and rate-limiting strategies for repeated or high-traffic queries to avoid hitting API limits.
Modularization for Future Expansion: Design components in a modular way to allow for easy addition of new features (e.g., expanding to other sports).
Detailed Table Customization: Consider implementing a config system that allows specifying table columns based on the query type, giving users the most relevant information for each query.
