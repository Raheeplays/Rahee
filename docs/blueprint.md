# **App Name**: Rahee Cards

## Core Features:

- Secure Login & Lobby: Players log in using their unique name and 'Rahee Key' validated against a Firebase database. Includes real-time authentication feedback and a 'Waiting for Opponent' state for multiplayer matches.
- Interactive Card Display: Dynamic display of a player's active card, showcasing character image, name, '♤♡♧◇' symbol, and detailed stats (No, Speed, Skill, Power, XP). Remaining cards are visually represented as a stacked pile.
- Real-time 1v1 Battles: Core turn-based stat comparison gameplay for two players. Each player selects a stat, and the system compares values to determine the winner, synchronizing game state via Firebase Realtime Database.
- Card Management & Transfer: Automated card shuffling, equal distribution to all players at game start, and real-time transfer of a losing player's top card to the winner. Card ownership is dynamically updated in Firebase.
- Basic AI Opponent (Solo Mode): Allows solo players to practice against a basic AI tool that randomly selects a stat for comparison, simulating an opponent's turn.
- Player Feedback System: A dedicated section for players to submit game ratings (1-5 stars) and text-based feedback, along with their name and email, all stored and managed via Firebase.
- Responsive Game Interface: Ensures the application interface adapts seamlessly to different screen sizes and orientations (portrait and landscape), providing an optimal user experience across various devices.

## Style Guidelines:

- Background color: A dark, desaturated cool grey (RGB: #15191C), providing a subtle hint of the primary blue and a stark contrast for UI elements.
- Primary interactive color: A vibrant, clear blue (RGB: #32Befa), used for actionable buttons, selected states, and key highlights.
- Accent color: A high-contrast cyan-green (RGB: #0CCEBB), analogous to the primary blue, employed for emphasis, notifications, and secondary interactive elements.
- Body and headline font: 'Inter' (sans-serif), chosen for its modern, clean lines, and excellent readability, particularly for game stats and UI text.
- Standard playing card suit symbols (♤♡♧◇) are integrated into card designs, complemented by minimalistic and functional icons for navigation and game actions.
- A sleek, organized layout with clear separation for active cards, player information, and game controls, optimized for both portrait and landscape viewing.
- Smooth, subtle animations for critical interactions such as card transfers, win/lose outcomes, and transitions between game screens (login, menu, game play) to enhance engagement.