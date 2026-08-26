# QEase Backend Notes

Analytics dates use UTC boundaries. Timestamp fields are stored as MongoDB dates, and date filters such as `date=2026-08-26` cover `00:00:00.000Z` through (but not including) the next UTC day.

Admin analytics and operational history require an authenticated admin or authorized staff account. User token history uses the authenticated user's database identity.
