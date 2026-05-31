
GET /food-items
Purpose: load all FoodItems for user to choose from
Request: plain
Response data: FoodItem[]

POST /food-items
Purpose: Create new FoodItem
Request: body must contain FoodItem json object
Response data: FoodItem
Notes:

PATCH /food-items/:foodItemId
Purpose: update details for a particular FoodItem
Request: url must have foodItemId as a param, json details object must be sent as the body
Response data:
Notes:

DELETE /food-items/:foodItemId
Purpose:
Request:
Response data:
Notes:

GET /food-log-entries?date=YYYY-MM-DD
Purpose:
Request:
Response data:
Notes:

POST /food-log-entries
Purpose:
Request:
Response data:
Notes:

PATCH /food-log-entries/:foodLogEntryId
Purpose:
Request:
Response data:
Notes:

DELETE /food-log-entries/:foodLogEntryId
Purpose:
Request:
Response data:
Notes:


GET /meals?date=YYYY-MM-DD
Purpose:
Request:
Response data:
Notes:

POST /meals
Purpose:
Request:
Response data:
Notes:


GET /targets
Purpose:
Request:
Response data:
Notes:

PATCH /targets
Purpose:
Request:
Response data:
Notes:

POST /app-data/import
Purpose:
Request:
Response data:
Notes:
