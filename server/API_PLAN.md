## Food items

### GET /food-items

Purpose: Load all FoodItem objects for the current user.

Request: No body required.

Response data: FoodItem[]

Notes: Later this will use the authenticated user. For now it can use the dummy/current user.

### POST /food-items

Purpose: Create a new FoodItem.

Request: Body must be CreateFoodItemRequestBody.

Response data: FoodItem

Notes: Server will eventually create foodItemId, userId, and dateCreated.

### PATCH /food-items/:foodItemId

Purpose: Update details for a specific FoodItem.

Request:

- URL must include foodItemId as a param.

- Body must be UpdateFoodItemRequestBody.

Response data: FoodItem

Notes: Body should contain at least one field to update.

### DELETE /food-items/:foodItemId

Purpose: Remove a specific FoodItem from storage.

Request:

- URL must include foodItemId as a param.

Response data: FoodItem

Notes: Response returns the deleted FoodItem.

## Food log entries

### GET /food-log-entries?date=YYYY-MM-DD

Purpose: Get FoodLogEntry objects for a selected date.

Request:

- URL must include a date query string.

- Date must be in YYYY-MM-DD format.

Response data: FoodLogEntry[]

Notes: Later this will use the authenticated user.

### POST /food-log-entries

Purpose: Create a new FoodLogEntry.

Request: Body must be CreateFoodLogEntryRequestBody.

Response data: FoodLogEntry

Notes: Server should eventually calculate calories and protein from the linked FoodItem and weight.

### PATCH /food-log-entries/:foodLogEntryId

Purpose: Update a specific FoodLogEntry.

Request:

- URL must include foodLogEntryId as a param.

- Body must be UpdateFoodLogEntryRequestBody.

Response data: FoodLogEntry

Notes: This can be implemented later if editing log entries is not needed yet.

### DELETE /food-log-entries/:foodLogEntryId

Purpose: Remove a specific FoodLogEntry from storage.

Request:

- URL must include foodLogEntryId as a param.

Response data: FoodLogEntry

Notes: Response returns the deleted FoodLogEntry.

## Meals

### GET /meals?date=YYYY-MM-DD

Purpose: Get Meal objects for a selected date.

Request:

- URL must include a date query string.

- Date must be in YYYY-MM-DD format.

Response data: Meal[]

Notes: This does not use mealId. The date is a query filter.

### POST /meals

Purpose: Create a new Meal in storage.

Request: Body must be CreateMealRequestBody.

Response data: Meal

Notes: Server will eventually create mealId, userId, and createdAt.

### PATCH /meals/:mealId

Purpose: Update a specific Meal.

Request:

- URL must include mealId as a param.

- Body must be UpdateMealRequestBody.

Response data: Meal

Notes: This can be implemented later.

### DELETE /meals/:mealId

Purpose: Remove a specific Meal from storage.

Request:

- URL must include mealId as a param.

Response data: Meal

Notes: This can be implemented later.

## Targets

### GET /targets

Purpose: Get nutritional targets for calories and protein.

Request: No body required.

Response data: Targets

Notes: Targets probably belong to the current user.

### PATCH /targets

Purpose: Update nutritional targets in storage.

Request: Body must be UpdateTargetsRequestBody.

Response data: Targets

Notes: Body should contain at least one target field to update.

## App data import

### POST /app-data/import

Purpose: Import a full AppDataBackup into database storage.

Request: Body must be AppDataBackup.

Response data: BackupImportSummary

Notes:

- This is a migration/import route, not a normal day-to-day app route.

- It should validate the full backup before importing.

- It should return counts of imported records.