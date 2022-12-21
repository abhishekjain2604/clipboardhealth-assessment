# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

# Ticket 1

Currently each agent have 1 single ID, that is our own internal system ID
Now the facilities want to assign their own ID to the agent. Which means each agent can have as many different IDs as the facilties he/she has worked at
Of course these IDs will be different than the one that we have currently and will not be a replacement for that.
For this, we'll need a new table that can map an agent to a facility and store the new custom ID assigned by that facility to that  given agent
This will be a many to many table between `Facilities` and `Agents` with structure that looks something like this

Table Name: FacilitiesAgents
Columns: FacilityId, AgentId, AgentCustomId
Foreign Keys: Facilities(FacilityId), Agents(AgentId)
Primary Key(Composite): FacilityId, AgentId

Effort Estimates: 0.5 Days
Steps:
- Create an SQL script for new table creation
- Create a new migration file in the repository(this step will depend on the manner in which we are handling the DB migrations)

# Ticket 2

Since this new table will be empty initiallly, we need to populate it to support our existing shifts that have already been completed
We need to reach out to all the facilities and ask them for this data, compile them into a single CSV file and use that to populate the newly created table
For facilities that don't want to assign their own IDs to the agents, we can simply set the `AgentCustomId` to be the same as `AgentId` to maintain uniformity

Effort Estimates: 0.5 days

# Ticket 3

Every time an agent has been assigned to any given facility for the first time for any shift, we need to make an entry to this new table as well so that an agent can have a custom ID assigned to him/her by that  facility

Effort estimates: 2 Days(Dev + Test cases + Integration testing with Frontend)
Steps
- In "assign shift" API, check if there exist an entry for the given agent and given facility in the newly created table
- If yes, proceed as planned
- If not, create an entry into the table
- The "assign shift" API will now also take a new field in the request body denoting `AgentCustomId`. If left blank, the `AgentId` can be used as default
- The test cases needs to be updated accordingly

# Ticket 4

`getShiftsByFacility` and `generateReport` needs to be updated to utilise these new data points and generate PDFs that displays the new `AgentCustomId`

Effort Estimates: 3 days (Dev + Test cases + Integration testing with Frontend)
Steps:
- After fetching the list of shifts for a given facility, calculate the unique set of agents that worked on all those shifts
- These unique agents and their `AgentId` will then be used to fire a single additional query in our database to fetch the `AgentCustomId` from the new table
- The `AgentCustomId` thus fetched for all the agents needs to be added in the shift details that we fetched earlier so that the shift object now has both `AgentId` and `AgentCustomId`
- `generateReport` will now accordingly be updated to use `AgentCustomId` instead of `AgentId` while generating PDFs