# App

GymPass style app

## Functional Requirements
- [X] Should be able to register a user
- [X] Should be able to register a gym
- [ ] Should be able to authenticate a user
- [ ] Should be able to get logged user's profile
- [ ] Should be able to get logged user's check-ins number
- [ ] Should be able to get logged user's check-ins history
- [ ] Should be able to get near gyms
- [ ] Should be able to find gyms by their name
- [ ] Should be able to check-in a user at a gym
- [ ] Should be able to validate user's check-in

## Business Rules
- [X] Should not be able to register users with the same e-mail address
- [ ] Should not allow users check-in more than once a day
- [ ] Should not allow users check-in if their is no gyms near their location (100m)
- [ ] Should be able to allow check-in validation up to 20 minutes after creation
- [ ] Should be able to allow check-in validation only by administrators
- [ ] Should be able to allow gym registration only by administrators

## Non-Functional Requirements
- [X] The user's password must be encrypted
- [X] The app data must be persisted in a PostgreSQL database
- [ ] All data returns must be paginated with 20 items per page
- [ ] The user must be identified by a JWT token