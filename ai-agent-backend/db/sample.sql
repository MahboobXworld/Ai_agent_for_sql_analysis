-- Create messy customers table
CREATE TABLE cstmrs (
    id INTEGER PRIMARY KEY,
    nme TEXT,
    eml TEXT,
    joined_on TEXT
);

-- Create messy transactions table
CREATE TABLE trnsxns (
    txn_id INTEGER PRIMARY KEY,
    cust_id INTEGER,
    amt$ REAL,
    dt TEXT,
    typ TEXT,
    FOREIGN KEY (cust_id) REFERENCES cstmrs(id)
);

-- Insert fake data into customers
INSERT INTO cstmrs (id, nme, eml, joined_on) VALUES
(1, 'John D.', 'john@x.com', '2021-03-04'),
(2, 'Sara P.', NULL, '2020-11-15'),
(3, 'Alan K.', 'alan@z.com', '2022-01-01');

-- Insert fake data into transactions
INSERT INTO trnsxns (txn_id, cust_id, amt$, dt, typ) VALUES
(101, 1, 120.5, '2024-05-01', 'sale'),
(102, 1, -20.0, '2024-05-02', 'refund'),
(103, 2, 99.9, '2024-04-12', 'sale'),
(104, 3, 0.0, '2024-05-03', 'test');
