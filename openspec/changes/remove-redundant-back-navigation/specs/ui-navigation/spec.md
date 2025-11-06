## REMOVED Requirements
### Requirement: Back to TopWindow Navigation Links
**Reason**: Redundant navigation element that duplicates functionality already available in the main header navigation. Creates user confusion and UI clutter.
**Migration**: Users will continue to have access to homepage navigation through the main header navigation which includes Home, Features, and other primary navigation elements.

#### Scenario: Current redundant navigation
- **WHEN** user is on any feature sub-page
- **THEN** they see both main header navigation AND "Back to TopWindow" link
- **AND** both provide the same functionality (returning to homepage)

#### Scenario: Simplified navigation after removal
- **WHEN** user is on any feature sub-page
- **THEN** they see only the main header navigation
- **AND** can return to homepage using the Home link in the main navigation
- **AND** navigation experience is cleaner and less confusing