SnapShare Scaling Plan

1. Assumptions

Given:

Registered users: 10,000,000
Daily active users (DAU): 10%
Each active user uploads 1 photo per day
Each active user views 50 feed pages per day
Average photo size: 2 MB
Thumbnail size: 50 KB
1 day ≈ 100,000 seconds (for quick estimation)
Peak traffic is estimated at 5× average traffic
Daily Active Users
DAU = 10,000,000 × 10%
= 1,000,000 users

2. Capacity Estimates
   Uploads per Second
   1,000,000 uploads/day ÷ 100,000 seconds/day
   = 10 uploads/second

Feed Views per Second (Average)
1,000,000 users × 50 views/day
= 50,000,000 feed views/day

50,000,000 ÷ 100,000
= 500 feed views/second

Feed Views per Second (Peak)
500 × 5
= 2,500 feed views/second

Storage Per Year

Photos per year:

1,000,000 photos/day × 365
= 365,000,000 photos/year

Storage per photo:

2 MB + 50 KB
≈ 2.05 MB

Annual storage:

365,000,000 × 2.05 MB
= 748,250,000 MB

≈ 748,250 GB
≈ 748 TB/year

3. Read-Heavy or Write-Heavy?

SnapShare is read-heavy.

Reason:

Uploads: 10 requests/second
Feed views: 500 requests/second average
Feed views: 2,500 requests/second peak

Users read content far more often than they upload photos. Therefore the architecture should prioritise fast content delivery through caching, read replicas and a CDN.

4. Why Photos Should Not Be Stored in the Database

Large image files should not be stored directly in the database because:

They consume significant database storage.
Database backups become larger and slower.
Database performance decreases.
Scaling becomes more expensive.

Instead, photos should be stored in object storage (such as Amazon S3, Azure Blob Storage, or Google Cloud Storage), while the database stores only metadata such as photo ID, owner, upload date and storage location.

5. Architecture Diagram
   Plain Text
   +----------------+
   | Users |
   +--------+-------+
   |
   v
   +----------------+
   | CDN |
   +--------+-------+
   |
   v
   +----------------+
   | Load Balancer |
   +--------+-------+
   |
   +--------------+--------------+
   | |
   v v
   +-------------+ +-------------+
   | App Server | | App Server |
   +------+------+ +------+------+
   | |
   +-------------+---------------+
   |
   v
   +-------------+
   | Cache |
   +------+------+
   |
   v
   +----------------------+
   | Primary Database |
   +----------+-----------+
   |
   v
   +----------------------+
   | Read Replica |
   +----------------------+

^
|
+-------------+-------------+
| |
v |
+------------+ |
| Queue | |
+------+-----+ |
| |
v |
+------------+ |
| Thumbnail |--------------------+
| Worker |
+------+-----+
|
v
+------------+
| Object |
| Storage |
+------------+ 6. Component Explanations
CDN

Delivers photos from locations close to users, reducing latency and server load.

Load Balancer

Distributes incoming traffic across multiple application servers to prevent overload.

App Servers

Handle user requests such as uploads, feed generation and authentication.

Cache

Stores frequently accessed feed data and metadata to reduce database reads.

Primary Database

Stores application data that requires consistent writes.

Read Replica

Handles read queries so that the primary database can focus on writes.

Object Storage

Stores photo files and thumbnails efficiently and at scale.

Queue

Buffers thumbnail-processing tasks so uploads complete quickly.

Thumbnail Worker

Processes queued jobs and generates thumbnails in the background.

7. Photo Upload Flow
   User uploads a photo through the application.
   The request reaches the load balancer.
   The load balancer forwards the request to an app server.
   The app server stores the original image in object storage.
   The app server saves photo metadata in the primary database.
   The app server creates a thumbnail-generation job.
   The job is placed in the queue.
   The user immediately receives a successful upload response.
   A thumbnail worker reads the job from the queue.
   The worker generates a 50 KB thumbnail.
   The thumbnail is stored in object storage.
   Metadata is updated in the database.
   The CDN caches and serves images to users requesting the feed.
8. Trade-Offs
   Trade-Off 1: Cache vs Consistency

Using a cache makes feed loading faster and reduces database load, but users may occasionally see slightly stale data.

Trade-Off 2: Queue-Based Processing vs Simplicity

Using a queue improves upload performance because thumbnail generation is asynchronous, but it increases system complexity.

Trade-Off 3: Read Replicas vs Operational Cost

Read replicas improve read scalability, but they increase infrastructure and maintenance costs.

9. Git Commit
   Shell
   git add .
   git commit -m "Day 7 assignment"
   git push origin main
