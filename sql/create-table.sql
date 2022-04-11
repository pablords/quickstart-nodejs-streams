CREATE TABLE stream (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
Region VARCHAR(100),
Country VARCHAR(100),
ItemType VARCHAR(100),
SalesChannel VARCHAR(100),
OrderPriority VARCHAR(100),
OrderDate VARCHAR(100),
OrderID VARCHAR(100),
ShipDate VARCHAR(100),
UnitsSold VARCHAR(100),
UnitPrice VARCHAR(100),
UnitCost VARCHAR(100),
TotalRevenue VARCHAR(100),
TotalCost VARCHAR(100),
TotalProfit VARCHAR(100),
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)