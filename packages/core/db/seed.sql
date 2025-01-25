-- Clear existing data
TRUNCATE TABLE hook_domains, hooks, domains, users, teams CASCADE;

-- Teams
INSERT INTO teams (id, name, created_at) VALUES
('team_01', 'Alpha Team', '2024-01-01 10:00:00'),
('team_02', 'Beta Squad', '2024-01-02 11:00:00'),
('team_03', 'Gamma Group', '2024-01-03 12:00:00'),
('team_04', 'Delta Force', '2024-01-04 13:00:00'),
('team_05', 'Epsilon Unit', '2024-01-05 14:00:00'),
('team_06', 'Zeta Division', '2024-01-06 15:00:00'),
('team_07', 'Eta Team', '2024-01-07 16:00:00'),
('team_08', 'Theta Group', '2024-01-08 17:00:00'),
('team_09', 'Iota Squad', '2024-01-09 18:00:00'),
('team_10', 'Kappa Unit', '2024-01-10 19:00:00');

-- Users
INSERT INTO users (id, email, name, team_id, created_at) VALUES
('user_01', 'john@example.com', 'John Doe', 'team_01', '2024-01-01 10:00:00'),
('user_02', 'jane@example.com', 'Jane Smith', 'team_01', '2024-01-02 11:00:00'),
('user_03', 'bob@example.com', 'Bob Johnson', 'team_02', '2024-01-03 12:00:00'),
('user_04', 'alice@example.com', 'Alice Brown', 'team_02', '2024-01-04 13:00:00'),
('user_05', 'charlie@example.com', 'Charlie Wilson', 'team_03', '2024-01-05 14:00:00'),
('user_06', 'diana@example.com', 'Diana Prince', 'team_03', '2024-01-06 15:00:00'),
('user_07', 'eric@example.com', 'Eric Taylor', 'team_04', '2024-01-07 16:00:00'),
('user_08', 'fiona@example.com', 'Fiona Green', 'team_04', '2024-01-08 17:00:00'),
('user_09', 'george@example.com', 'George Black', 'team_05', '2024-01-09 18:00:00'),
('user_10', 'helen@example.com', 'Helen White', 'team_05', '2024-01-10 19:00:00');

-- Domains
INSERT INTO domains (id, name, user_id, created_by_user_id, team_id, plan, payment_status, created_at) VALUES
('domain_01', 'example1.com', 'user_01', 'user_01', NULL, 'pro', 'active', '2024-01-01 10:00:00'),
('domain_02', 'example2.com', 'user_02', 'user_01', NULL, 'basic', 'active', '2024-01-02 11:00:00'),
('domain_03', 'example3.com', 'user_03', 'user_02', NULL, 'pro', 'active', '2024-01-03 12:00:00'),
('domain_04', 'example4.com', 'user_04', 'user_02', NULL, 'enterprise', 'active', '2024-01-04 13:00:00'),
('domain_05', 'example5.com', 'user_05', 'user_03', NULL, 'basic', 'pending', '2024-01-05 14:00:00'),
('domain_06', 'example6.com', 'user_06', 'user_03', NULL, 'pro', 'active', '2024-01-06 15:00:00'),
('domain_07', 'example7.com', 'user_07', 'user_04', NULL, 'basic', 'active', '2024-01-07 16:00:00'),
('domain_08', 'example8.com', 'user_08', 'user_04', NULL, 'enterprise', 'active', '2024-01-08 17:00:00'),
('domain_09', 'example9.com', 'user_09', 'user_05', NULL, 'pro', 'pending', '2024-01-09 18:00:00'),
('domain_10', 'example10.com', 'user_10', 'user_05', NULL, 'basic', 'active', '2024-01-10 19:00:00');

-- Hooks
INSERT INTO hooks (id, name, domain_id, created_at) VALUES
('hook_01', 'Notification Hook', 'domain_01', '2024-01-01 10:00:00'),
('hook_02', 'Payment Hook', 'domain_01', '2024-01-02 11:00:00'),
('hook_03', 'User Hook', 'domain_02', '2024-01-03 12:00:00'),
('hook_04', 'Order Hook', 'domain_02', '2024-01-04 13:00:00'),
('hook_05', 'Delivery Hook', 'domain_03', '2024-01-05 14:00:00'),
('hook_06', 'Status Hook', 'domain_03', '2024-01-06 15:00:00'),
('hook_07', 'Alert Hook', 'domain_04', '2024-01-07 16:00:00'),
('hook_08', 'Monitor Hook', 'domain_04', '2024-01-08 17:00:00'),
('hook_09', 'Backup Hook', 'domain_05', '2024-01-09 18:00:00'),
('hook_10', 'Security Hook', 'domain_05', '2024-01-10 19:00:00');

-- Hook Domains
INSERT INTO hook_domains (id, hook_id, domain_id, total_requests, created_at) VALUES
('hd_01', 'hook_01', 'domain_01', 1000, '2024-01-01 10:00:00'),
('hd_02', 'hook_02', 'domain_02', 2000, '2024-01-02 11:00:00'),
('hd_03', 'hook_03', 'domain_03', 1500, '2024-01-03 12:00:00'),
('hd_04', 'hook_04', 'domain_04', 3000, '2024-01-04 13:00:00'),
('hd_05', 'hook_05', 'domain_05', 2500, '2024-01-05 14:00:00'),
('hd_06', 'hook_06', 'domain_06', 1800, '2024-01-06 15:00:00'),
('hd_07', 'hook_07', 'domain_07', 4000, '2024-01-07 16:00:00'),
('hd_08', 'hook_08', 'domain_08', 3500, '2024-01-08 17:00:00'),
('hd_09', 'hook_09', 'domain_09', 2200, '2024-01-09 18:00:00'),
('hd_10', 'hook_10', 'domain_10', 1700, '2024-01-10 19:00:00');