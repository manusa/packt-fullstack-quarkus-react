INSERT INTO "users" ("id", "name", "password", "created", "version")
    VALUES (0, 'admin', '$2a$10$7b.9iLgXFVh.r1u9HEbMv.EDL3JcJgldsWHUg4etSUh4wCNGuExye', NOW(), 1)
    ON CONFLICT DO NOTHING;
INSERT INTO "user_roles" ("id", "role")
    VALUES (0, 'admin')
    ON CONFLICT DO NOTHING;
