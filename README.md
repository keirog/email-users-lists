# Email Users Lists matching
[![Build Status](https://travis-ci.org/Financial-Times/email-users-lists.svg?branch=master)](https://travis-ci.org/Financial-Times/email-users-lists) [![Test Coverage](https://codeclimate.com/github/Financial-Times/email-users-lists/badges/coverage.svg)](https://codeclimate.com/github/Financial-Times/email-users-lists/coverage) [![Dependency Status](https://david-dm.org/Financial-Times/email-users-lists.svg)](https://david-dm.org/Financial-Times/email-users-lists) [![devDependency Status](https://david-dm.org/Financial-Times/email-users-lists/dev-status.svg)](https://david-dm.org/Financial-Times/email-users-lists#info=devDependencies)

REST API for Users' Lists matching

## Implemented Endpoints:
### /lists
**GET /lists**: returns an array of list objects

**POST /lists**: adds the posted list object to the list of lists

### /lists/:listId
**GET /lists/listId**: returns a specific list object

**PUT /lists/listId**: edits the specific list object updating the provided properties

**DELETE /lists/listId**: deletes the specific list object 

### /users
**GET /users**: returns an array of user objects

**POST /users**: adds the posted user object to the list of users

### /users/:userUuid
**GET /users/userUuid**: returns a specific user object

**PUT /users/userUuid**: edits the specific user object updating the provided properties

**DELETE /users/userUuid**: deletes the specific user object 

### /users/:userUuid/lists
**GET /users/:userUuid/lists**: returns a populated list of lists for the provided user

**POST /users/:userUuid/lists**: adds the posted list object to the user list of lists (the list _id must pre-exist)

### /users/:userUuid/lists/:listId
**DELETE /users/:userUuid/lists/:listId**: removes the provided list from the user


### /lists/:listId/users
**GET /lists/:listId/users**: returns a list of users members of the provided list
