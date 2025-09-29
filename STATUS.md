# Admin Migration Status

| Module              | List            | Create      | Read        | Update      | Delete      | Notes                                   |
| ------------------- | --------------- | ----------- | ----------- | ----------- | ----------- | --------------------------------------- |
| Dashboard           | Done            | N/A         | Done        | N/A         | N/A         | GET /api/admin/dashboard wired to React |
| Exams               | Done            | Done        | Done        | Done        | Done        | Create/Update wired to API              |
| Exam Questions      | Dynamic filters | N/A         | Done        | N/A         | Done        | Attach/remove wired                     |
| Quizzes             | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/quizzes              |
| Quiz Types          | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/quiz-types           |
| Questions (Library) | Done            | N/A         | Done        | N/A         | N/A         | Filters + pagination via /api/questions |
| Import Questions    | Done            | N/A         | Done        | N/A         | N/A         | POST /api/questions/import wired        |
| Comprehensions      | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/comprehensions       |
| Question Types      | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/question-types       |
| Lesson Bank         | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/lessons              |
| Video Bank          | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/videos               |
| Users               | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/users                |
| User Groups         | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/user-groups          |
| Import Users        | Done            | N/A         | Done        | N/A         | N/A         | POST /api/users/import wired            |
| Categories          | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/categories           |
| Sub Categories      | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/sub-categories       |
| Tags                | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/tags                 |
| Sections            | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/sections             |
| Skills              | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/skills               |
| Topics              | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/topics               |
| Plans               | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/plans                |
| Subscriptions       | Done            | Done        | Done        | Done        | Done        | CRUD wired to /api/subscriptions        |
| Payments            | Not started     | Not started | Not started | Not started | Not started |                                         |
| Settings (All)      | Done            | N/A         | Done        | N/A         | N/A         | CRUD wired to /api/settings             |
