-- Sample data for Product Management System
-- This file will be executed on application startup

INSERT INTO products (name, category, price, quantity, description, created_at, updated_at) VALUES
('iPhone 15 Pro', 'Electronics', 999.99, 50, 'Latest iPhone with advanced camera system', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Samsung Galaxy S24', 'Electronics', 899.99, 30, 'Flagship Android smartphone with AI features', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MacBook Pro 16"', 'Electronics', 2499.99, 15, 'Professional laptop with M3 chip', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dell XPS 13', 'Electronics', 1299.99, 25, 'Ultrabook with premium design', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sony WH-1000XM5', 'Electronics', 399.99, 40, 'Noise-canceling wireless headphones', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Nike Air Max 270', 'Footwear', 150.00, 100, 'Comfortable running shoes with air cushioning', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Adidas Ultraboost 22', 'Footwear', 180.00, 75, 'High-performance running shoes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Converse Chuck Taylor', 'Footwear', 65.00, 120, 'Classic canvas sneakers', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Levi''s 501 Jeans', 'Clothing', 89.99, 80, 'Classic straight-fit denim jeans', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nike Dri-FIT T-Shirt', 'Clothing', 29.99, 150, 'Moisture-wicking athletic t-shirt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Patagonia Fleece Jacket', 'Clothing', 129.99, 45, 'Warm and sustainable fleece jacket', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('The Great Gatsby', 'Books', 12.99, 200, 'Classic American novel by F. Scott Fitzgerald', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Clean Code', 'Books', 45.99, 60, 'Programming best practices guide', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Atomic Habits', 'Books', 18.99, 90, 'Guide to building good habits', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Yoga Mat', 'Sports', 39.99, 70, 'Non-slip exercise mat for yoga and fitness', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dumbbells Set', 'Sports', 199.99, 25, 'Adjustable weight dumbbells for home gym', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tennis Racket', 'Sports', 149.99, 35, 'Professional tennis racket with carbon frame', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Coffee Maker', 'Home & Kitchen', 89.99, 40, 'Programmable drip coffee maker', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Instant Pot', 'Home & Kitchen', 129.99, 30, 'Multi-functional pressure cooker', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Blender', 'Home & Kitchen', 79.99, 50, 'High-speed blender for smoothies', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
