# Roadmap

This document outlines the planned upgrades and enhancements for LyrixSync.

## Future Features

* [x] **Real-time Updates:** Implement real-time updates using WebSockets to instantly reflect changes in the song list across all connected clients.
* [x] **Lyric Synchronization:** Add the core feature of synchronizing lyrics with the music. This will involve a new data model for lyrics and a UI for displaying and editing them.
    * [x] Create `Lyric` model in `schema.prisma`
    * [x] Create API route for lyrics
    * [x] Create a page to display lyrics
    * [x] Implement lyric editing functionality
    * [x] Implement lyric and audio synchronization
* [ ] **User Profiles:** Create user profiles where users can see their added songs and manage their account.
* [ ] **Improved UI/UX:** Enhance the user interface with features like pagination, search, and sorting for the song list.

## Bugs Fixed

* [x] **Error Handling in `page.tsx`**
* [x] **Missing `key` Prop in `page.tsx`**
* [x] **No Loading State in `page.tsx`**
* [x] **Unauthorized Access in `songs.controller.ts`**